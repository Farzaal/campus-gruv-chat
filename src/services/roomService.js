const roomModel = require('../models/roomModel.js');

module.exports = {

    async getUserRoom(room_id) {
        const room = await roomModel.getUserRoom(room_id);
        return room;
    },

    async saveRoomMessage({ room_id, user_id, message }) {
        const roomMsg = await roomModel.saveRoomMessage({ room_id, user_id, message });
        return roomMsg;
    },

    async getUserMessages(room_id) {
        const usrMsg = await roomModel.getUserMessages(room_id);
        return usrMsg;
    },

    async updUserSocketId(userId, socketId) {
        const updSocketId = await roomModel.updUserSocketId(userId, socketId);
        return updSocketId;
    },

    async getUserSocketId(user_id) {
        const usrSocketId = await roomModel.getUserSocketId(user_id);
        return usrSocketId;
    },

    async roomWiseUser(room_id) {
        const usr = await roomModel.roomWiseUser(room_id);
        return usr;
    }

}