const express = require('express');
const searchController = require('./searchController');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/getRelatedData', searchController.search)


module.exports = router