const express = require('express');
const router = express.Router();

const presensiController = require('../controllers/presensiController');

// Middleware autentikasi
const { authenticateToken } = require('../middleware/permissionMiddleware');

// Semua route presensi HARUS melalui token auth
router.use(authenticateToken);
router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);
// PRESENSI ROUTES SESUAI MODUL
router.post('/check-out', presensiController.CheckOut);

// (TIDAK ADA DELETE & UPDATE DALAM MODUL PRESENSI)
module.exports = router;
