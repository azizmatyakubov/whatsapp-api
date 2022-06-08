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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Schema, model } = mongoose_1.default;
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    avatar: { type: String, default: "https://picsum.photos/200/300" },
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = this;
        const plainPW = newUser.password;
        if (newUser.isModified("password")) {
            const hash = bcrypt_1.default.hash(plainPW, 11);
            newUser.password = hash;
        }
        next();
    });
});
UserSchema.methods.toJSON = function () {
    const userDoc = this;
    const userObj = userDoc.toObject();
    delete userObj.password;
    delete userObj.__v;
    return userObj;
};
UserSchema.statics.checkCredentials = function (email, plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(plainPassword, user.password);
            if (isMatch) {
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
};
exports.default = model("User", UserSchema);
