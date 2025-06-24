require('dotenv').config()
const app = require('./app')
const http = require('http')
const { Server } = require('socket.io')
const db = require('./db/queries')

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const activeUsers = {}
io.on('connection', (socket) => {

    socket.on('user-connect', async (data, callback) => {
        const groupId = parseInt(data.groupId)
        const userId = parseInt(data.userId)
        socket.join(groupId)

        try {
            const mssgArr = await db.getAllMessagesInGroup(groupId)
            io.to(groupId).emit('getMessages', mssgArr)


            //get nickname from userId
            const userNickname = await db.getNicknameFromUserId(userId)

            //if their aren't any active members in group, we'll make the array empty and initialize it with [].

            if (!activeUsers[groupId]) {
                activeUsers[groupId] = []
            }

            //check if user is already in the active array.
            const alreadyExists = activeUsers[groupId].some((user) => user.userId === userId)


            //if user isn't in the active array.
            if (!alreadyExists) {
                activeUsers[groupId].push({ userId: userId, userNickname: userNickname, socketId: socket.id })
            }

            //active users array sent to the handler
            io.to(groupId).emit('active-users', activeUsers[groupId])
            callback({ status: 200, msg: 'Active users fetched!' })

        } catch (error) {
            callback({ status: 500, msg: 'Error fetching active users!' })
            console.log("Err", error)
        }
    })

    socket.on('send-message', async (data, callback) => {
        const { messageText, groupId, userId } = data
        console.log(messageText, groupId, userId)
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
            //add message to db and get the last message object.
            await db.postMessageInDb(userId, parseInt(groupId, 10), formatted, messageText)

            const mssgArr = await db.getAllMessagesInGroup(parseInt(groupId))
            const lastMessage = mssgArr[mssgArr.length - 1]
            // send the last message to the client
            io.to(parseInt(groupId, 10)).emit('receive-message', lastMessage)
            //ack
            callback({ status: 200, msg: 'Message sent successfully!' })
        } catch (error) {
            console.log("Err", error)
            callback({ status: 500, msg: 'Error sending message!' })
        }
    })

    socket.on('user-disconnecting', (data) => {
        let { groupId } = data
        groupId = parseInt(groupId)
        Object.keys(activeUsers).forEach((id) => {
            activeUsers[id] = activeUsers[id].filter(
                (user) => user.socketId !== socket.id
            );
            io.to(groupId).emit("active-users", activeUsers[groupId]);
        });
        console.log(activeUsers)
    })
})


const PORT = process.env.PORT
server.listen(PORT, () => console.log(`SERVER WITH SOCKET.IO STARTED ON PORT: ${PORT}`))