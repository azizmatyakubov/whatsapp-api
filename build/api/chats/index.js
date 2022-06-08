"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_1 = __importDefault(require("./model"));
const ChatsRouter = express_1.default.Router();
ChatsRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield model_1.default.findOne({ name: req.body.chatName });
        if (chat) {
            res.status(400).send({ message: "Chat already exists" });
        }
        else {
            const { userId, chatName } = req.body;
            const newChat = new model_1.default({ name: chatName });
            newChat.members.push(userId);
            yield newChat.save();
            res.status(201).send(newChat);
        }
    }
    catch (error) {
        res.status(400).send();
        console.log(error);
        next(error);
    }
}));
ChatsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield model_1.default.find().populate('members');
        if (chats) {
            res.send(chats);
        }
        else {
            res.send("There are no chats");
        }
    }
    catch (error) {
        res.status(500).send();
        console.log(error);
        next(error);
    }
}));
ChatsRouter.get("/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield model_1.default.findOne({ name: req.params.name }).populate('members');
        if (!chats) {
            return res.status(404).send(`Chat with name ${req.params.name} not found`);
        }
        else {
            res.send(chats);
        }
    }
    catch (error) {
        res.status(500).send();
        console.log(error);
        next(error);
    }
}));
exports.default = ChatsRouter;
function next(error) {
    throw new Error("Function not implemented.");
}
