import mongoose from "mongoose";
import User from '../users/model.js'
// const User = UserSchema

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  // id: string
  createdAt: {
    type: Number,
    required: true,
  }, // the number of elapsed ms after 1/1/1970
});

const ChatSchema = new mongoose.Schema({
  members: 
      [ {type: mongoose.Schema.Types.ObjectId, ref : User} ]
  ,
  messages: {
    type: [MessageSchema],
    default: [],
  },
});

const Chat = mongoose.model("chats", ChatSchema);

export default Chat;