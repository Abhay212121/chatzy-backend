const db = require('../db/queries')


const getMessages = async (req, res) => {
    const groupId = parseInt(req.query.groupId, 10);
    try {
        const messages = await db.getAllMessagesInGroup(groupId)
        return res.json({ status: 200, messages: messages, msg: 'Messages fetched!' })
    } catch (error) {
        console.log(error)
        return res.json({ status: 500, error: error })
    }
}

module.exports = { getMessages }