const { Router } = require('express')
const { postMessage } = require('../controllers/messageController')

const messagesRouter = Router()

messagesRouter.post('/postMessage', postMessage)

module.exports = messagesRouter