import { Server } from "socket.io";
import { createServer } from "http";
import app from "./app.js";
import Chat from "./api/chats/model.js";

export const httpServer = createServer(app);
const io = new Server(httpServer);



io.on('connection', (socket) => {

    console.log(socket.rooms);


    socket.on('join', (payload) => {
        const packet = JSON.parse(payload);
        const { userId, chatName } = packet;
        socket.join(chatName);
        socket.emit('message', {
            user: 'admin',
            text: `${userId} has joined.`
        });
        socket.broadcast.to(chatName).emit('message', {
            user: 'admin',
            text: `${userId} has joined.`
        });
        Chat.findOne({ name: chatName }).then(chat => {
            if (chat) {
                chat.members.push(userId);
                chat.save();
            } else {
                const newChat = new Chat({ name: chatName });
                newChat.members.push(userId);
                newChat.save();
            }
        })
    })



    socket.on('sendMessage', async (payload) => {
        try {
            const packet = JSON.parse(payload);
            const { userId, chatName, text } = packet;
            const message = {
                userId,
                text,
                createdAt: new Date().getTime()
            };
            socket.emit('message', message);
            socket.broadcast.to(chatName).emit('message', message);
            const chat = await Chat.findOne({ name: chatName });
            chat.messages.push(message);
            await chat.save();
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })
})


