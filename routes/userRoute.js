const { Router } = require('express')
const { postUserToDb } = require('../controllers/userController')

const userRoute = Router()

userRoute.post('/register', postUserToDb)
userRoute.post('/login', (req, res) => res.send('Uesr logged in!'))

module.exports = userRoute