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
exports.httpServer = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const app_js_1 = __importDefault(require("./app.js"));
const model_js_1 = __importDefault(require("./api/chats/model.js"));
exports.httpServer = (0, http_1.createServer)(app_js_1.default);
const io = new socket_io_1.Server(exports.httpServer);
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('join', (room) => {
        socket.join(room);
        socket.to(room).emit('message', `User has joined with id ${socket.id}`);
    });
    socket.on('sendMessage', ({ message, room }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield model_js_1.default.findOneAndUpdate({ name: room }, { $push: { messages: message } });
            socket.to(room).emit('message', message);
        }
        catch (error) {
        }
    }));
    socket.on('disconnect', () => {
        io.emit('message', 'User has left');
    });
});
