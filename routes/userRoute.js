const { Router } = require('express')
const { postUserToDb, loginUser } = require('../controllers/userController')

const userRoute = Router()

userRoute.post('/register', postUserToDb)
userRoute.post('/login', loginUser)

module.exports = userRoute