const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  createRequest,
  getRequests,
  getRequestById,
  updateStatus,
  assignRequest,
  scheduleDemo,
  addNote
} = require('../controllers/demoRequestController');

const router = express.Router();

// Public
router.post('/', createRequest);

// Protected (Admin and Sales Executive)
router.use(protect);

router.get('/', getRequests);
router.get('/:id', getRequestById);
router.patch('/:id/status', updateStatus);
router.patch('/:id/schedule', scheduleDemo);
router.post('/:id/notes', addNote);

// Admin only
router.patch('/:id/assign', authorize('ADMIN'), assignRequest);

module.exports = router;
