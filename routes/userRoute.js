const { Router } = require('express')
const { postUserToDb, loginUser, setNickname } = require('../controllers/userController')

const userRoute = Router()

userRoute.post('/register', postUserToDb)
userRoute.post('/login', loginUser)
userRoute.post('/setnickname', setNickname)

module.exports = userRoute