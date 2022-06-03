import express from "express";
import cors from 'cors'
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

app.use(express.json())
app.use(cors())

app.get('/api/test', (req, res) => {
    res.send({
        message: 'Test seccessful'
    })
})



io.on("connection", (socket) => {
    console.log("New client connected");
    console.log(socket.id)

    socket.emit("message", {
        message: "Welcome to the chat app"
        })

    socket.on("sendMessage", (data) => {
        console.log(data)
        io.emit("message", data)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected")
    })
})

  


export default app;
