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
exports.JWTAuthMiddleware = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const tool_js_1 = require("./tool.js");
const JWTAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        next((0, http_errors_1.default)(401, "Send Access Token"));
    }
    else {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const payload = (0, tool_js_1.verifyAccessToken)(req, res, next);
            req.user = {
                _id: payload._id,
                username: payload.username,
            };
            next();
        }
        catch (error) {
            next((0, http_errors_1.default)(401, "Token Not Valid"));
        }
    }
});
exports.JWTAuthMiddleware = JWTAuthMiddleware;
