const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
var jwt = require('jsonwebtoken');
const roomService = require('./src/services/roomService.js');

const server = http.createServer(app);
server.listen(process.env.PORT || 4000)

const io = require('socket.io').listen(server);
app.use(cors());

io.on('connection', function (socket) {

    socket.on('joinRoom', async () => {
        const decoded = jwt.decode(socket.handshake.query.token, {complete: true});
        socket.join(socket.handshake.query.room_id);
        await roomService.updUserSocketId(decoded.payload.uid, socket.id);
        const usrMsg = await roomService.getUserMessages(socket.handshake.query.room_id);
        io.to(socket.id).emit('joinRoom', usrMsg);
    });

    socket.on('message', async (message) => {
        const decoded = jwt.decode(socket.handshake.query.token, {complete: true});
        await roomService.saveRoomMessage({ room_id: socket.handshake.query.room_id, user_id:decoded.payload.uid, message:message  });
        io.to(socket.handshake.query.room_id).emit('message', message);
    });
});