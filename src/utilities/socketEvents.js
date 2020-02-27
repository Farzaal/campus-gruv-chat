const roomService = require('../services/roomService.js');
const jwt = require('jsonwebtoken');

module.exports = function (io) {

    io.on('connection', function (socket) {

        socket.on('joinRoom', async () => {
            const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
            socket.join(socket.handshake.query.room_id);
            await roomService.updUserSocketId(decoded.payload.uid, socket.id);
            const usrMsg = await roomService.getUserMessages(socket.handshake.query.room_id);
            io.to(socket.id).emit('joinRoom', usrMsg);
        });

        socket.on('message', async (userMessage) => {
            try {
                const { user_id, message } = userMessage;
                const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
                io.to(socket.handshake.query.room_id).emit('message', [userMessage]);
                await roomService.saveRoomMessage({ room_id: socket.handshake.query.room_id, user_id: user_id, message: message });
            } catch(e) {
                console.log(e);
            }
        });

        socket.on('disconnect', async (reason) => {
            console.log("Disconnect Reason : ", reason);
            const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
            await roomService.updUserSocketId(decoded.payload.uid, '');
        });

        socket.on('error', (error) => {
            console.log("error", error);
        });

    });
}