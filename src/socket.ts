import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import app from "./app";
import Chat from "./api/chats/model";
import User from "./api/users/model";
import {JwtPayload} from './types/Types'
export const httpServer = createServer(app);

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    let id;
    // go grab this users chats 
    // we are going to join them all
    // and then we are going to emit the messages
    const decoded = jwt.verify(socket.handshake.headers.token as string, process.env.JWT_SECRET!) as JwtPayload
    const user = await User.findById(decoded._id )

    const chats = await Chat.find({members: user?._id.toString()})

    socket.join(chats.map(chat => chat._id.toString()))
    chats.map(chat => id = chat._id.toString())


    //socket outgoing-msg
    socket.on('outgoing-msg', async (payload) => {
        console.log(payload)
        // send to specific user
        try {
            const chat = await Chat.findById(payload.chatId)
            const user = await User.findById(payload.userId)
            const message = {
                chatId: payload.chatId.toString(),
                userId: payload.userId,
                userName: user?.username,
                text: payload.message,
                createdAt: Date.now()
            }
            chat.messages.push(message)
            await chat.save()
            console.log('hello')
            socket.to(payload.chatId).emit('incoming-msg', message)
        } catch (error) {
            console.log(error)
        }
    })

    // disconnect
    socket.on('disconnect', (payload) => {
        console.log('disconnect')
        })
})
