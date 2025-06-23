require('dotenv').config()
const { body, validationResult } = require("express-validator")
const db = require('../db/queries')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userNameRegex = /^[A-Za-z0-9 ]+$/

const validateUserData = [
    body('userName').trim().matches(userNameRegex).withMessage('Symbols not allowed'),
    body('userMail').isEmail().withMessage('Enter a valid email'),
    body('userPassword').isLength({ min: 6, max: 15 }).withMessage('Password too short!')
]

const postUserToDb = [validateUserData, async (req, res) => {


    const errors = validationResult(req)
    const existingErrors = errors.array()
    const { userName, userMail, userPassword } = req.body

    try {
        const user = await db.getUserFromDb(userName);

        //if there's a user with same userName
        if (user.length != 0) {
            existingErrors.push({ path: 'userName', msg: 'Username already taken' })
        }

        //if there are errors
        if (existingErrors.length > 0) {
            return res.json({ status: 400, msg: 'validation errors found!', errors: existingErrors })
        }

        //hashing the password and registering the user in the db.
        const hashedPassword = await bcrypt.hash(userPassword, 10)
        await db.addUserToDb(userName, userMail, hashedPassword)

        return res.json({ status: 200, msg: 'User registered to db!' })
    } catch (error) {
        return res.json({ status: 500, msg: 'Internal server error!' })
    }
}]

const loginUser = async (req, res) => {
    const { userName, userPassword, rememberMe } = req.body
    try {
        //check if username exists or not in db.
        const user = await db.getUserFromDb(userName);
        if (user.length == 0) {
            return res.json({ status: 404, msg: [{ path: 'userName', msg: 'User not found!' }] })
        }
        //check if the password matches.
        const match = await bcrypt.compare(userPassword, user[0].user_password)
        if (!match) {
            return res.json({ status: 401, msg: [{ path: 'userPassword', msg: 'Wrong password!' }] })
        }
        //data to store in the token.
        const payload = {
            userId: user[0].user_id,
            userName: user[0].user_name
        }
        const token = jwt.sign(payload, process.env.MY_SECRET_KEY, rememberMe ? { expiresIn: '7d' } : { expiresIn: '1h' });
        return res.json({ status: 200, msg: 'User logged in!', token: token, userName: user[0].user_name, userId: user[0].user_id })
    } catch (error) {
        return res.send({ status: 500, msg: 'Internal Server Error!' })
    }
}

const setNickname = async (req, res) => {
    const { userId, nickName } = req.body
    try {
        await db.updateNicknameInDb(nickName, userId)
        return res.json({ status: 200, msg: 'Nickname updated!' })
    } catch (error) {
        return res.json({ status: 401, msg: 'There was an error updating nickname!' })
    }
}

module.exports = { postUserToDb, loginUser, setNickname }