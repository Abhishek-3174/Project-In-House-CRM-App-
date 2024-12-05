const express = require('express');
const studentprogram = require('./studentprograms');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', studentprogram.index)
router.post('/add', studentprogram.add)
router.get('/view/:id', studentprogram.view)
router.put('/edit/:id', studentprogram.edit)
router.delete('/delete/:id', studentprogram.deleteData)


module.exports = router