const express = require('express');
const { login, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);

// Admin: list users by role
router.get('/users', protect, authorize('ADMIN'), getUsers);

module.exports = router;
