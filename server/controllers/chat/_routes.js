const express = require('express');
const chat = require('./chat');
const router = express.Router();

router.post('/chatbot', chat.chatHandler);

module.exports = router;
