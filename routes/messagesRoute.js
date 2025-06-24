const { Router } = require('express')
const { postMessage, getMessages } = require('../controllers/messageController')

const messagesRouter = Router()

messagesRouter.post('/postMessage', postMessage)
messagesRouter.get('/getMessage', getMessages)

module.exports = messagesRouter