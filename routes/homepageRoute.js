const { Router } = require('express')
const { getWelcomePage } = require('../controllers/homepageController')
const { verifyToken } = require('../middlewares/authMiddleware')

const homepageRouter = Router()

homepageRouter.get('/welcome', verifyToken, getWelcomePage)

module.exports = homepageRouter