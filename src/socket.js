import { Server } from "socket.io";
import { createServer } from "http";
import app from "./app.js";
import Chat from "./api/chats/model.js";

export const httpServer = createServer(app);
const io = new Server(httpServer);



io.on('connection', (socket) => {

    console.log(socket.id)

    socket.on('join', (room) => {
        socket.join(room)
        socket.to(room).emit('message', `User has joined with id ${socket.id}`);
    })

    socket.on('sendMessage', async ({ message, room }) => {
        try {
            await Chat.findOneAndUpdate({name: room}, {$push: {messages: message}})
            socket.to(room).emit('message', message);
        } catch (error) {
            
        }
    })






    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })
})


