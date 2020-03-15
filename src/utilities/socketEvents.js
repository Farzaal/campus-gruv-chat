const roomService = require('../services/roomService.js');
const constants = require('../utilities/constants.js');
const jwt = require('jsonwebtoken');
const R = require('ramda');

module.exports = function (io) {

    io.on('connection', function (socket) {

        socket.on('isLoggedIn', async () => {
            try {
                const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
                await roomService.updUserSocketId(decoded.payload.uid, socket.id);
                console.log(socket.id);
                io.to(socket.id).emit('isLoggedIn', true);
            } catch(exp) {
                console.log(exp);
                io.to(socket.id).emit('isLoggedIn', false);
            }
        });

        socket.on('joinRoom', async ({ room_id }) => {
            const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
            socket.join(room_id);
            const usrMsg = await roomService.getUserMessages(room_id);
            io.to(socket.id).emit('joinRoom', usrMsg);
        });

        socket.on('message', async (usrMessage) => {
            try {
                const { user_id, message, profile_pic_url, name, room_id } = usrMessage;
                const decoded = jwt.decode(socket.handshake.query.token, { complete: true });
                const room = io.sockets.adapter.rooms[room_id];
                let usrSocket, sockId = '';
                if(R.lt(room.length, 2)) {
                    usrSocket = await roomService.roomWiseUser(room_id);
                    const usr = usrSocket.find(soc => R.equals(socket.id, soc.socket_id));
                    const sock = usrSocket.find(soc => !R.equals(socket.id, soc.socket_id));
                    sockId = sock.socket_id;
                    io.to(socket.id).emit('message', usrMessage);
                    usrMessage.notification = `${usr.name} has messaged you`;
                    console.log(usrMessage, sockId);
                    !R.isNil(sockId) ? io.to(sockId).emit('user_message', usrMessage) : '';
                } else {
                    io.to(room_id).emit('message', usrMessage);
                }
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