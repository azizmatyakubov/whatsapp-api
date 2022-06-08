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
const JWTMiddleware_js_1 = require("../../auth/JWTMiddleware.js");
const http_errors_1 = __importDefault(require("http-errors"));
const tool_js_1 = require("../../auth/tool.js");
const model_1 = __importDefault(require("./model"));
const usersRouter = express_1.default.Router();
usersRouter.post("/account", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new model_1.default(req.body);
        const { _id, username } = yield newUser.save();
        const accessToken = (0, tool_js_1.generateAccessToken)({
            _id: _id,
            username: username,
        }, res, next);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });
        res.status(201).send({ _id });
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/session", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_1.default.checkCredentials(email, password);
        if (user) {
            const accessToken = (0, tool_js_1.generateAccessToken)({
                _id: user._id,
                username: user.username,
            });
            res.cookie({
                httpOnly: true,
                sameSite: "lax",
                secure: false,
            });
            res.status(200).send({ accessToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Unauthorized"));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/", JWTMiddleware_js_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.user;
        const user = yield model_1.default.findById(_id);
        if (user) {
            res.status(200).send(user);
        }
        else {
            next("User not found!");
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/me", JWTMiddleware_js_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.user._id);
        if (user) {
            res.send(user);
        }
        else {
            next(404);
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/:id", JWTMiddleware_js_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.params.id);
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put("/me", JWTMiddleware_js_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield model_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (updatedUser) {
            res.send(updatedUser);
        }
        else {
            next(404);
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.delete("/session", JWTMiddleware_js_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accessToken");
    }
    catch (error) {
        next(error);
    }
}));
exports.default = usersRouter;
