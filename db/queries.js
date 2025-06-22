const pool = require('./pool')

const addUserToDb = async (userName, userMail, userPassword) => {
    await pool.query(`INSERT INTO users(user_name,user_mail,user_password) VALUES($1,$2,$3)`, [userName, userMail, userPassword])
}

const getUserFromDb = async (userName) => {
    const { rows } = await pool.query(`SELECT * FROM users WHERE user_name = ($1)`, [userName])
    return rows
}

module.exports = { addUserToDb, getUserFromDb }