const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const SuratKeluar = require('../models/suratKeluarModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.serviceAccountKey);

const storage = new Storage({
  projectId: 'project-polda',
  credentials: serviceAccount,
});

const bucketName = 'bucket-polda-document';

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadSuratFile = upload.single('file_url');

exports.getAllSuratMasuk = handlerFactory.getAll(SuratKeluar);

exports.createSuratMasuk = catchAsync(async (req, res, next) => {
  const { no, pengirim, tanggalSurat, tanggalDiterima, perihal } = req.body;
  const { file } = req;
  // Generate a unique filename for the uploaded file
  const filename = `${uuidv4()}${path.extname(file.originalname)}`;

  // Upload the file to Google Cloud Storage
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(filename);
  const stream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });
  stream.on('error', (err) => {
    next(new AppError(err.message, 400));
  });
  stream.on('finish', async () => {
    // Construct the URL for the uploaded file
    const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

    const kegiatan = await SuratKeluar.create({
      no,
      pengirim,
      tanggalSurat,
      tanggalDiterima,
      perihal,
      file_url: url,
    });

    res.status(201).json({
      status: 'success',
      data: {
        kegiatan,
      },
    });
  });
  stream.end(file.buffer);
});

exports.updateSuratMasuk = catchAsync(async (req, res, next) => {
  const { no, pengirim, tanggalSurat, tanggalDiterima, perihal } = req.body;
  const { file } = req;

  // Find the handicraft record by ID
  const suratMasuk = await SuratKeluar.findByPk(req.params.id);

  if (!suratMasuk) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the handicraft record with the new data
  if (no) {
    suratMasuk.no = no;
  }
  if (pengirim) {
    suratMasuk.pengirim = pengirim;
  }
  if (tanggalSurat) {
    suratMasuk.tanggalSurat = tanggalSurat;
  }
  if (tanggalDiterima) {
    suratMasuk.tanggalDiterima = tanggalDiterima;
  }
  if (perihal) {
    suratMasuk.perihal = perihal;
  }
  if (file) {
    // Generate a unique filename for the uploaded file
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    // Upload the file to Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(filename);
    const stream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.on('error', (err) => {
      next(new AppError(err.message, 400));
    });
    stream.on('finish', async () => {
      // Construct the URL for the uploaded file
      const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

      // Update the handicraft record with the uploaded file URL
      suratMasuk.file_url = url;
      await suratMasuk.save();
    });
    stream.end(file.buffer);
  }

  await suratMasuk.save();

  res.status(200).json({
    status: 'success',
    data: suratMasuk,
  });
});

exports.getSuratMasuk = handlerFactory.getOne(SuratKeluar);

exports.deleteAssociatedFile = catchAsync(async (req, res, next) => {
  const suratKeluar = await SuratKeluar.findByPk(req.params.id);

  const filename = suratKeluar.file_url.split('/').pop();

  console.log(filename);

  if (!suratKeluar) {
    return res.status(404).json({
      status: 'fail',
      message: 'kegiatan not found',
    });
  }

  // Delete the associated file from Google Cloud Storage
  const file = storage.bucket('bucket-polda-document').file(filename);
  await file.delete();
  next();
});

exports.deleteSuratMasuk = handlerFactory.deleteOne(SuratKeluar);
