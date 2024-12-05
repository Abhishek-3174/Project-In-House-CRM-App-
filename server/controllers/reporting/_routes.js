const express = require('express');
const reporting = require('./reporting');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', reporting.index)
router.post('/index', reporting.data)


module.exports = router