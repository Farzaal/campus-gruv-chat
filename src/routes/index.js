const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

router.post('/send/notification', NotificationController.sendUserNotification); 

module.exports = router;