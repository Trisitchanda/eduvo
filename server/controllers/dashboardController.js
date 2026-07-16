const { DemoRequest } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'SALES_EXECUTIVE') {
      where.assigned_to = req.user.id;
    }

    const totalRequests = await DemoRequest.count({ where });
    const newRequests = await DemoRequest.count({ where: { ...where, status: 'New' } });
    const scheduledDemos = await DemoRequest.count({ where: { ...where, status: 'Demo Scheduled' } });
    const completedDemos = await DemoRequest.count({ where: { ...where, status: 'Demo Completed' } });
    const convertedLeads = await DemoRequest.count({ where: { ...where, status: 'Converted' } });

    // Overdue: preferred_demo_datetime < now AND status not in Demo Completed/Converted/Lost/Cancelled
    const overdueFollowups = await DemoRequest.count({
      where: {
        ...where,
        preferred_demo_datetime: { [Op.lt]: new Date() },
        status: { [Op.notIn]: ['Demo Completed', 'Converted', 'Lost', 'Cancelled'] }
      }
    });

    const conversionPercentage = totalRequests === 0 ? 0 : ((convertedLeads / totalRequests) * 100).toFixed(1);

    res.json({
      totalRequests,
      newRequests,
      scheduledDemos,
      completedDemos,
      convertedLeads,
      overdueFollowups,
      conversionPercentage
    });
  } catch (error) {
    next(error);
  }
};

const getChartData = async (req, res, next) => {
  try {
    const where = {};
    if (req.user.role === 'SALES_EXECUTIVE') {
      where.assigned_to = req.user.id;
    }

    // Leads by status
    const statuses = ['New', 'Contacted', 'Demo Scheduled', 'Demo Completed', 'Converted', 'Lost', 'Cancelled'];
    const data = [];

    for (const status of statuses) {
      const count = await DemoRequest.count({ where: { ...where, status } });
      data.push({ name: status, value: count });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getChartData };
