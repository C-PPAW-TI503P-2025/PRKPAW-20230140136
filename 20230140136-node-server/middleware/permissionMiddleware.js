 	exports.addUserData = (req, res, next) => {
 	  console.log('Middleware: Menambahkan data user dummy...');
 	  req.user = {
 	    id: 125,
 	    nama: 'User 1',
 	    role: 'karyawan'
 	  };
 	  next(); 
 	};
 	
 	exports.isAdmin = (req, res, next) => {
 	  if (req.user && req.user.role === 'admin') {
 	    console.log('Middleware: Izin admin diberikan.');
 	    next(); 
 	  } else {
 	    console.log('Middleware: Gagal! Pengguna bukan admin.');
 	    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin'});
 	  }
 	};

	const { body, validationResult } = require('express-validator');

// Middleware validasi untuk Presensi (checkIn & checkOut)
exports.validatePresensi = [
  body('checkIn')
    .optional()
    .isISO8601()
    .withMessage('Format checkIn tidak valid, gunakan format tanggal ISO8601'),
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Format checkOut tidak valid, gunakan format tanggal ISO8601'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];