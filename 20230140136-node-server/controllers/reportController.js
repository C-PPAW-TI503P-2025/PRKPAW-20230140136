const { Presensi } = require("../models");
const { Op } = require("sequelize");
const presensiRecords = require("../data/presensiData");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    let options = { where: {} };

    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    if (tanggalMulai && tanggalSelesai) {
      options.where.tanggalPresensi = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};


