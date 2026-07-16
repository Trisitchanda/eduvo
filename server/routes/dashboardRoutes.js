const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getDashboardStats, getChartData } = require('../controllers/dashboardController');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/chart-data', getChartData);

module.exports = router;
