const express = require('express');
const payment = require('./payment')
const paymentCon = require('./paymentController')

const router = express.Router();


router.post('/add', payment.add)
router.get('/', payment.index)
router.post('/paymentController/add',paymentCon.add)
router.get('/paymentController', paymentCon.index)

module.exports = router