const express = require('express');

const router = express.Router();

const arsipController = require('../controllers/arsipController');

router.route('/').get(arsipController.getAllSurat);

router.route('/dashboard').get(arsipController.getDashboard);

module.exports = router;
