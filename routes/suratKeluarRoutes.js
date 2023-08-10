const express = require('express');

const router = express.Router();

const suratKeluarController = require('../controllers/suratKeluarController');

router
  .route('/')
  .get(suratKeluarController.getAllSuratMasuk)
  .post(
    suratKeluarController.uploadSuratFile,
    suratKeluarController.createSuratMasuk
  );

router
  .route('/:id')
  .get(suratKeluarController.getSuratMasuk)
  .patch(
    suratKeluarController.uploadSuratFile,
    suratKeluarController.updateSuratMasuk
  )
  .delete(
    suratKeluarController.deleteAssociatedFile,
    suratKeluarController.deleteSuratMasuk
  );

module.exports = router;
