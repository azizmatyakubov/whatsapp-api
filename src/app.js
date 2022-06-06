import express from "express";
import cors from 'cors'
import usersRouter from "./api/users/index.js";
import chatsRouter from "./api/chats/index.js";


const app = express();

app.use(express.json())
app.use(cors())

app.get('/api/test', (req, res) => {
    res.send({
        message: 'Test seccessful'
    })
})

app.use('/users', usersRouter)
app.use('/chats', chatsRouter)

  


export default app;
