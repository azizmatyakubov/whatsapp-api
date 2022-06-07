import express from "express";
import cors from 'cors'
import usersRouter from "./api/users/index.js";
import chatsRouter from "./api/chats/index.js";
import { badRequestErrorHandler, unauthorizedErrorHandler, notFoundErrorHandler, genericErrorHandler } from "./errorHandlers.js";


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


// Error handlers
app.use(badRequestErrorHandler)
app.use(unauthorizedErrorHandler)
app.use(notFoundErrorHandler)
app.use(genericErrorHandler)



export default app;
