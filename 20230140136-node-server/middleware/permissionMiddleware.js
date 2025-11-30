const jwt = require("jsonwebtoken");

const JWT_SECRET = "jwt_secret_12345";

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Akses ditolak. Format Authorization harus 'Bearer <token>'.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa." });
    }

    if (!userPayload.id) {
      return res.status(403).json({
        message: "Token tidak valid. Payload tidak memiliki ID pengguna.",
      });
    }

    req.user = userPayload;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({
      message: "Token tidak memiliki informasi role.",
    });
  }

  if (req.user.role === "admin") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Akses ditolak. Hanya untuk admin." });
};
