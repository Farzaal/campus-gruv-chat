const roomService = require('../services/roomService.js');
const jwt = require('jsonwebtoken');

module.exports = function (io) {

    io.on('connection', function (socket) {

        socket.on('joinRoom', async ({ room_id }) => {
            const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
            socket.join(room_id);
            await roomService.updUserSocketId(decoded.payload.uid, socket.id);
            const usrMsg = await roomService.getUserMessages(room_id);
            io.to(socket.id).emit('joinRoom', usrMsg);
        });

        socket.on('message', async (usrMessage) => {
            try {
                const { user_id, message, profile_pic_url, name, room_id } = usrMessage;
                const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
                io.to(room_id).emit('message', [usrMessage]);
                await roomService.saveRoomMessage({ room_id, user_id, message });
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