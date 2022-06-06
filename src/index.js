import app from "./app.js";
import mongoose from "mongoose";
import listendpoints from 'express-list-endpoints'
import { httpServer } from "./socket.js";

const PORT = process.env.PORT || 3001;
console.log(process.env.MONGO_URL, 'process.env.MONGO_URL')
mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")

    httpServer.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
        console.table(listendpoints(app))
    })
})

