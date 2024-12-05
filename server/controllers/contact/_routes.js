const express = require('express');
const contact = require('./contact');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', contact.index)
router.post('/add', contact.add)
router.post('/add-property-interest/:id', auth, contact.addPropertyInterest)
router.get('/view/:id', contact.view)
router.put('/edit/:id', auth, contact.edit)
router.delete('/delete/:id', auth, contact.deleteData)
router.post('/deleteMany', auth, contact.deleteMany)
router.get('/studentprograms/:contactId', contact.getStudentPrograms)
router.get('/orders/:contactId', contact.getOrders)
router.get('/tasks/:contactId', contact.getTasks)
router.get('/cases/:contactId', contact.getOrders)


module.exports = router