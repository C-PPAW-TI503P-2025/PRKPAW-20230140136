const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');

// Middleware resmi sesuai modul UCP
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Hanya admin yang boleh mengakses laporan harian
router.get(
  '/daily',
  authenticateToken,  // token harus valid
  isAdmin,            // role user harus admin
  reportController.getDailyReport
);

module.exports = router;
