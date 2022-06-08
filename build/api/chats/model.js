"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const model_js_1 = __importDefault(require("../users/model.js"));
// const User = UserSchema
const MessageSchema = new mongoose_1.default.Schema({
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
const ChatSchema = new mongoose_1.default.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    { type: mongoose_1.default.Schema.Types.ObjectId, ref: model_js_1.default },
  ],
  messages: {
    type: [MessageSchema],
    default: [],
  },
});
const Chat = mongoose_1.default.model("chats", ChatSchema);
exports.default = Chat;
