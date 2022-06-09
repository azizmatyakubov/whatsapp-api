import express from "express";
import validator from 'validator';

import Chats from "./model";
import { JWTAuthMiddleware } from "../../auth/JWTMiddleware";


const ChatsRouter = express.Router();

ChatsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
    const reqUser = req.user 
    const recipient = req.body.recipient

    const members = [reqUser, recipient]
    try {
      const chat = await Chats.findOne({ members: { $all: members } });
        if(chat){
            res.status(400).send(chat);
        } else{
            const newChat = new Chats()
            newChat.members = members;
            await newChat.save();

            res.status(201).send(newChat);
        }
    } catch (error) {
        res.status(400).send();
        console.log(error)
        next(error)
    }
});



ChatsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
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


ChatsRouter.get("/:chatId", JWTAuthMiddleware, async (req, res, next) => {
    try {
        const chats = await Chats.findOne({ _id: req.params.chatId }).populate('members');
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