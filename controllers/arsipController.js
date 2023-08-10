const SuratKeluar = require('../models/suratKeluarModel');
const SuratMasuk = require('../models/suratMasukModel');
const catchAsync = require('../utils/catchAsync');

exports.getDashboard = catchAsync(async (req, res, next) => {
  const suratKeluar = await SuratKeluar.findAll();
  const suratMasuk = await SuratMasuk.findAll();

  res.status(200).json({
    status: 'success',
    countSuratKeluar: suratKeluar.length,
    countSuratMasuk: suratMasuk.length,
    sumSurat: suratKeluar.length + suratMasuk.length,
  });
});

exports.getAllSurat = catchAsync(async (req, res, next) => {
  const suratKeluar = await SuratKeluar.findAll();
  const suratMasuk = await SuratMasuk.findAll();

  const allSurat = [...suratKeluar, ...suratMasuk];

  res.status(200).json({
    status: 'success',
    data: allSurat,
  });
});
