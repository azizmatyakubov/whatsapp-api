"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const socket_1 = require("./socket");
const PORT = process.env.PORT || 3001;
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL must be defined');
}
mongoose_1.default.connect(process.env.MONGO_URL);
mongoose_1.default.connection.on("connected", () => {
    console.log("Connected to MongoDB");
    socket_1.httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.table((0, express_list_endpoints_1.default)(app_1.default));
    });
});
