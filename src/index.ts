import app from "./app";
import mongoose from "mongoose";
import listendpoints from 'express-list-endpoints'
import { httpServer } from "./socket";

const PORT = process.env.PORT || 3001;

if(!process.env.MONGO_URL){
    throw new Error('MONGO_URL must be defined');
}

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")

    httpServer.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
        console.table(listendpoints(app))
    })
})

