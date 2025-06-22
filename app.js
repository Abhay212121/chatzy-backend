require('dotenv').config()
const express = require('express')

const app = express()


app.get('/', (req, res) => res.send('Server started!'))

const PORT = process.env.PORT
app.listen(PORT, () => `SERVER STARTED OVER PORT:${PORT}`)