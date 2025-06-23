const db = require('../db/queries')

const postMessage = async (req, res) => {
    const { messageText, groupId, userId } = req.body
    const date = new Date();
    const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    const formatted = date.toLocaleString("en-IN", options);

    try {
        await db.postMessageInDb(userId, groupId, formatted, messageText)
        return res.json({ status: 200, msg: 'Message added!' })

    } catch (error) {
        return res.json({ status: 500, msg: 'Internal Server Error!' })
    }
}

module.exports = { postMessage }