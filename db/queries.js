const pool = require('./pool')

const addUserToDb = async (userName, userMail, userPassword) => {
    await pool.query(`INSERT INTO users(user_name,user_mail,user_password) VALUES($1,$2,$3)`, [userName, userMail, userPassword])
}

const getUserFromDb = async (userName) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE user_name = ($1)`, [userName])
    return rows
}

const updateNicknameInDb = async (userNickname, userId) => {
    await pool.query(`UPDATE users SET user_nickname = ($1) WHERE user_id = ($2)`, [userNickname, userId])
}

const postMessageInDb = async (userId, groupId, messageTime, messageText) => {
    await pool.query(`INSERT INTO messages(message_from,message_text,message_time,message_group) VALUES($1,$2,$3,$4)`, [userId, messageText, messageTime, groupId])
}

const getAllMessagesInGroup = async (groupId) => {
    const { rows } = await pool.query('SELECT user_name,user_nickname,message_id,message_from,message_text,message_time,message_group FROM users JOIN messages ON users.user_id = messages.message_from WHERE messages.message_group = $1 ORDER BY messages.message_time ASC', [groupId])
    return rows;
}

module.exports = { addUserToDb, getUserFromDb, updateNicknameInDb, postMessageInDb, getAllMessagesInGroup }