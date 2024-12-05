const express = require('express');
const program = require('./program');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', program.index)
router.post('/add', program.add)
router.get('/view/:id', program.view)
router.put('/edit/:id', program.edit)
router.delete('/delete/:id', program.deleteData)


module.exports = router