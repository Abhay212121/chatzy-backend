require('dotenv').config()
const express = require('express')
const cors = require('cors')

const userRoute = require('./routes/userRoute')
const homepageRouter = require('./routes/homepageRoute')
const messagesRouter = require('./routes/messagesRoute')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRoute)
app.use('/homepage', homepageRouter)
app.use('/messages', messagesRouter)

const PORT = process.env.PORT
app.listen(PORT, () => `SERVER STARTED OVER PORT:${PORT}`)