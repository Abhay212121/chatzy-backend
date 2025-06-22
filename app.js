require('dotenv').config()
const express = require('express')
const cors = require('cors')

const userRoute = require('./routes/userRoute')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRoute)

const PORT = process.env.PORT
app.listen(PORT, () => `SERVER STARTED OVER PORT:${PORT}`)