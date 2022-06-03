import app from "./app.js";
import mongoose from "mongoose";
import listendpoints from 'express-list-endpoints'
import { Server } from "socket.io";
import { createServer } from "http";


const httpServer = createServer(app);
export const io = new Server(httpServer);

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
    console.log('New client connected')
    console.log(socket.id)

    socket.emit('message', {
        message: 'Welcome to the chat app'
    })

    socket.on('sendMessage', (data) => {
        console.log(data)
        io.emit('message', data)
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})


mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")

    httpServer.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
        console.table(listendpoints(app))
    })
})

