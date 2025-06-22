const { body, validationResult } = require("express-validator")
const db = require('../db/queries')
const bcrypt = require('bcrypt')


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

module.exports = { postUserToDb }