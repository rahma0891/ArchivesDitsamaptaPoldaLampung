const express = require('express');

const router = express.Router();

const suratMasukController = require('../controllers/suratMasukController');

router
  .route('/')
  .get(suratMasukController.getAllSuratMasuk)
  .post(
    suratMasukController.uploadSuratFile,
    suratMasukController.createSuratMasuk
  );

router
  .route('/:id')
  .get(suratMasukController.getSuratMasuk)
  .patch(
    suratMasukController.uploadSuratFile,
    suratMasukController.updateSuratMasuk
  )
  .delete(
    suratMasukController.deleteAssociatedFile,
    suratMasukController.deleteSuratMasuk
  );

module.exports = router;
