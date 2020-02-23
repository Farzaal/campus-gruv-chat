const roomService = require('../services/roomService');
const R = require('ramda');

module.exports = {

    async sendUserNotification(req, res) {
        const { user_id, notification } = req.body;
        let message = 'User is offline', socketId = '', statusCode = 400;
        const userSocket = await roomService.getUserSocketId(user_id);
        // if(R.gt(userSocket.length, 0)) {
        if(userSocket[0].socket_id) {
            socketId = userSocket[0].socket_id; 
            if(!R.isNil(global.io.sockets.sockets[socketId])) {
                console.log(socketId, notification);
                global.io.to(socketId).emit('notification', notification);
                message = 'Notification sent successfully';
                statusCode = 200;
            }
        }
        return res.status(statusCode).json({ message });
    }
    
}