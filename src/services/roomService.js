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
    }

}