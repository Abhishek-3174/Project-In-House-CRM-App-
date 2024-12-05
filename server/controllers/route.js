const express = require('express');
const router = express.Router();

const contactRoute = require('./contact/_routes')
const propertyRoute = require('./property/_routes');
const leadRoute = require('./lead/_routes');
const taskRoute = require('./task/_routes');
const caseRoute = require('./cases/_routes');
const programRoute = require('./program/_routes');
const studentProgramRoute = require('./studentprograms/_routes');
const reportingRoute = require('./reporting/_routes');
const documentRoute = require('./document/_routes');
const userRoute = require('./user/_routes');
const esController = require('./ElasticSearchController/_routes')
const orderRoute = require('./order/_routes');
const emailRoute = require('./emailHistory/_routes');
const phoneCallRoute = require('./phoneCall/_routes');
const TextMsgRoute = require('./textMsg/_routes');
const meetingRoute = require('./meeting/_routes');
const paymentRoute = require('./payment/_routes');
const chatRoute = require('./chat/_routes');

//Api`s
router.use('/chat',chatRoute);
router.use('/contact', contactRoute);
router.use('/property', propertyRoute)
router.use('/lead', leadRoute)
router.use('/task', taskRoute);
router.use('/cases',caseRoute);
router.use('/program',programRoute);
router.use('/order',orderRoute);
router.use('/studentprograms',studentProgramRoute);
router.use('/elasticsearch',esController);
router.use('/document', documentRoute);
router.use('/reporting', reportingRoute);
router.use('/user', userRoute);
router.use('/payment', paymentRoute);

router.use('/email', emailRoute);
router.use('/phoneCall', phoneCallRoute);
router.use('/text-msg', TextMsgRoute);
router.use('/meeting', meetingRoute);

module.exports = router;