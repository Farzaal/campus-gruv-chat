const Dao = require('../utilities/Dao.js');

module.exports = {

    async getUserRoom(room_id) {
        const sql = `select * from room_master where id=${room_id}`; 
        const res = await Dao.executeQuery(sql);
        return res;
    },

    async saveRoomMessage({ room_id, user_id, message }) {
        const sql  = `insert into room_messages(room_id, user_id, message, created_at, updated_at) 
        values(${room_id}, ${user_id}, "${message.replace(/"/g, '')}", now(), now())`;
        const res = await Dao.executeQuery(sql);
        return res;
    },

    async getUserMessages(room_id) {
        const sql = `select rm.room_id, rm.user_id, rm.message, CONCAT(usr.first_name,' ',usr.last_name) AS name, usr.profile_pic_url 
        from room_messages rm, users usr WHERE rm.room_id = ${room_id} AND rm.user_id =usr.id ORDER BY rm.id asc LIMIT 30`;
        const res = await Dao.executeQuery(sql);
        return res;
    }
}