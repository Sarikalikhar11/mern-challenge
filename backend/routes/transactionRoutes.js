const express = require('express');
const router = express.Router();
const {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getAllData,
} = require('../controllers/transactionController');

router.get('./initialize', initializeDatabase);
router.get('/list', getTransactions);
router.get('/statistics', getStatistics);
router.get('/barChart', getBarChart);
router.get('/pieChart', getPieChart);
router.get('/allData', getAllData);

module.exports = router;
