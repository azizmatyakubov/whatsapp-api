import mongoose from "mongoose";
import User from '../users/model.js'
// const User = UserSchema

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  // id: string
  timestamp: {
    type: Number,
    required: true,
  }, // the number of elapsed ms after 1/1/1970
});

const ChatSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true,

  },
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