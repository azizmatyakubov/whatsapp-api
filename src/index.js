import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")

    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
        console.table(listendpoints(app))
    })
})