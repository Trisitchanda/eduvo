const { DemoRequest, User, ActivityLog, FollowupNote } = require('../models');
const { Op } = require('sequelize');

// Public route to submit a demo request
const createRequest = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    // Check for duplicates
    const existing = await DemoRequest.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existing) {
      res.status(400);
      throw new Error('A demo request with this email or phone already exists.');
    }

    const demoRequest = await DemoRequest.create(req.body);

    await ActivityLog.create({
      demo_request_id: demoRequest.id,
      action: 'Lead Created',
    });

    res.status(201).json(demoRequest);
  } catch (error) {
    next(error);
  }
};

// Admin / Sales route to get paginated requests
const getRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.user.role === 'SALES_EXECUTIVE') {
      where.assigned_to = req.user.id;
    }

    // Optional filters
    if (req.query.status) {
      where.status = req.query.status;
    }

    // Search
    if (req.query.search) {
      where[Op.or] = [
        { contact_name: { [Op.like]: `%${req.query.search}%` } },
        { institution_name: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    // Sorting (whitelist to prevent SQL injection)
    const ALLOWED_SORT = ['contact_name', 'institution_name', 'status', 'preferred_demo_datetime', 'createdAt'];
    const sortField = ALLOWED_SORT.includes(req.query.sortField) ? req.query.sortField : 'createdAt';
    const sortDir = req.query.sortDir === 'asc' ? 'ASC' : 'DESC';

    const { count, rows } = await DemoRequest.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, sortDir]],
      include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }]
    });

    res.json({
      totalItems: count,
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};


// Get single request
const getRequestById = async (req, res, next) => {
  try {
    const demoRequest = await DemoRequest.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name'] },
        { model: FollowupNote, as: 'notes', include: [{ model: User, as: 'author', attributes: ['name'] }] },
        { model: ActivityLog, as: 'activities', include: [{ model: User, as: 'user', attributes: ['name'] }] }
      ],
      order: [
        [{ model: ActivityLog, as: 'activities' }, 'createdAt', 'DESC'],
        [{ model: FollowupNote, as: 'notes' }, 'createdAt', 'DESC']
      ]
    });

    if (!demoRequest) {
      res.status(404);
      throw new Error('Demo request not found');
    }

    if (req.user.role === 'SALES_EXECUTIVE' && demoRequest.assigned_to !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to view this request');
    }

    res.json(demoRequest);
  } catch (error) {
    next(error);
  }
};

// Update status
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const demoRequest = await DemoRequest.findByPk(req.params.id);

    if (!demoRequest) {
      res.status(404);
      throw new Error('Demo request not found');
    }

    if (req.user.role === 'SALES_EXECUTIVE' && demoRequest.assigned_to !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Workflow validation
    const validTransitions = {
      'New': ['Contacted'],
      'Contacted': ['Demo Scheduled', 'Lost', 'Cancelled'],
      'Demo Scheduled': ['Demo Completed', 'Lost', 'Cancelled'],
      'Demo Completed': ['Converted', 'Lost'],
      'Converted': [],
      'Lost': [],
      'Cancelled': []
    };

    if (!validTransitions[demoRequest.status].includes(status)) {
      res.status(400);
      throw new Error(`Invalid status transition from ${demoRequest.status} to ${status}`);
    }

    const oldStatus = demoRequest.status;
    demoRequest.status = status;
    await demoRequest.save();

    await ActivityLog.create({
      demo_request_id: demoRequest.id,
      user_id: req.user.id,
      action: 'Status Changed',
      old_value: oldStatus,
      new_value: status
    });

    res.json(demoRequest);
  } catch (error) {
    next(error);
  }
};

// Assign Request (Admin only)
const assignRequest = async (req, res, next) => {
  try {
    const { assigned_to } = req.body;
    const demoRequest = await DemoRequest.findByPk(req.params.id);

    if (!demoRequest) {
      res.status(404);
      throw new Error('Demo request not found');
    }

    const user = await User.findByPk(assigned_to);
    if (!user || user.role !== 'SALES_EXECUTIVE') {
      res.status(400);
      throw new Error('Invalid assignee');
    }

    const oldAssignee = demoRequest.assigned_to;
    demoRequest.assigned_to = assigned_to;
    await demoRequest.save();

    await ActivityLog.create({
      demo_request_id: demoRequest.id,
      user_id: req.user.id,
      action: 'Lead Assigned',
      old_value: oldAssignee ? oldAssignee.toString() : null,
      new_value: assigned_to.toString()
    });

    res.json(demoRequest);
  } catch (error) {
    next(error);
  }
};

// Schedule Demo
const scheduleDemo = async (req, res, next) => {
  try {
    const { datetime } = req.body;
    const demoRequest = await DemoRequest.findByPk(req.params.id);

    if (!demoRequest) {
      res.status(404);
      throw new Error('Demo request not found');
    }

    if (new Date(datetime) < new Date()) {
      res.status(400);
      throw new Error('Cannot schedule demo in the past');
    }

    // Check overlapping (within 1 hour)
    if (demoRequest.assigned_to) {
      const existing = await DemoRequest.findOne({
        where: {
          assigned_to: demoRequest.assigned_to,
          status: 'Demo Scheduled',
          preferred_demo_datetime: {
            [Op.between]: [
              new Date(new Date(datetime).getTime() - 60 * 60 * 1000 + 1), 
              new Date(new Date(datetime).getTime() + 60 * 60 * 1000 - 1)
            ]
          },
          id: { [Op.ne]: demoRequest.id }
        }
      });

      if (existing) {
        res.status(400);
        throw new Error('Demo schedule conflict detected. Please choose another time.');
      }
    }

    const action = demoRequest.preferred_demo_datetime ? 'Demo Rescheduled' : 'Demo Scheduled';

    const oldDate = demoRequest.preferred_demo_datetime;
    demoRequest.preferred_demo_datetime = datetime;
    await demoRequest.save();

    await ActivityLog.create({
      demo_request_id: demoRequest.id,
      user_id: req.user.id,
      action,
      old_value: oldDate ? oldDate.toISOString() : null,
      new_value: new Date(datetime).toISOString()
    });

    res.json(demoRequest);
  } catch (error) {
    next(error);
  }
};

// Add Note
const addNote = async (req, res, next) => {
  try {
    const { note, next_followup_date } = req.body;
    const demoRequest = await DemoRequest.findByPk(req.params.id);

    if (!demoRequest) {
      res.status(404);
      throw new Error('Demo request not found');
    }

    const newNote = await FollowupNote.create({
      demo_request_id: demoRequest.id,
      user_id: req.user.id,
      note
    });

    await ActivityLog.create({
      demo_request_id: demoRequest.id,
      user_id: req.user.id,
      action: 'Note Added',
    });

    if (next_followup_date) {
      const oldDate = demoRequest.next_followup_date;
      demoRequest.next_followup_date = next_followup_date;
      await demoRequest.save();

      await ActivityLog.create({
        demo_request_id: demoRequest.id,
        user_id: req.user.id,
        action: 'Next Follow-up Scheduled',
        old_value: oldDate ? new Date(oldDate).toISOString() : null,
        new_value: new Date(next_followup_date).toISOString()
      });
    }

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRequest, getRequests, getRequestById, updateStatus, assignRequest, scheduleDemo, addNote };
