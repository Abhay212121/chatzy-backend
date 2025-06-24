const { Router } = require('express')
const { getAllUsersInGroup } = require('../controllers/groupController')

const groupRouter = Router()

groupRouter.get('/getAllUsers', getAllUsersInGroup)

module.exports = groupRouter