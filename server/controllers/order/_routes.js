const express = require('express');
const order = require('./order');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', order.index)
router.post('/add', order.add)
router.get('/view/:orderId', order.view)
router.put('/edit/:orderId', order.edit)
router.delete('/delete/:orderId', order.deleteData)


module.exports = router