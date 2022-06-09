import express from "express";
import cors from 'cors'
import usersRouter from "./api/users/index";
import chatsRouter from "./api/chats/index";
import { badRequestErrorHandler, unauthorizedErrorHandler, notFoundErrorHandler, genericErrorHandler } from "./errorHandlers";
import passport from "passport";
import googleStrategy from "./auth/googleOAuth";


const app = express();

passport.use('google', googleStrategy)


app.use(express.json())
app.use(cors())
app.use(passport.initialize())


app.get('/api/test', (req, res) => {
    res.send({
        message: 'Test seccessful'
    })
})


// Endpoints
app.use('/users', usersRouter)
app.use('/chats', chatsRouter)



// Error handlers
app.use(badRequestErrorHandler )
app.use(unauthorizedErrorHandler)
app.use(notFoundErrorHandler)
app.use(genericErrorHandler)



export default app;