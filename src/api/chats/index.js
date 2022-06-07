import express from "express";
import Chats from "./model.js";
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware.js";

const ChatsRouter = express.Router();

ChatsRouter.post("/", async (req, res) => {
    try {
      const chat = await Chats.findOne({name: req.body.chatName});
        if(chat){
            res.status(400).send({message: "Chat already exists"});
        } else{
            const { userId, chatName } = req.body;
            const newChat = new Chats({ name: chatName });
            newChat.members.push(userId);
            await newChat.save();
            res.status(201).send(newChat);
        }
    } catch (error) {
        res.status(400).send();
        console.log(error)
        next(error)
    }
});



ChatsRouter.get("/", JWTAuthMiddleware, async (req, res) => {
    try {
        const chats = await Chats.find({members: req.user}).populate('members');
        if(chats) {
            res.status(200).send(chats);
        } else {
            res.send("There are no chats");
        }
    } catch (error) {
        res.status(500).send();
        console.log(error)        
        next(error)
    }
})


ChatsRouter.get("/:name", async (req, res) => {

    try {
        const chats = await Chats.findOne({ name: req.params.name }).populate('members');

        if (!chats) {
          return res.status(404).send(`Chat with name ${req.params.name} not found`);
        } else {
            res.send(chats);
        }
    } catch (error) {
        res.status(500).send();
        console.log(error)
        next(error)
    }

  })



export default ChatsRouter
