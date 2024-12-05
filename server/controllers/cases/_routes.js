const express = require('express');
const cases = require('./cases');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, cases.index)
router.post('/add', cases.add)
router.get('/view/:id', cases.view)
router.put('/edit/:id', auth, cases.edit)
router.delete('/delete/:id', auth, cases.deleteData)


module.exports = router