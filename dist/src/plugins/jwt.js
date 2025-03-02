"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gwtGenerate = void 0;
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorLogger_1 = require("../../ERROR-LOGGER/errorLogger");
const gwtGenerate = (id) => {
    try {
        return jsonwebtoken_1.default.sign({ id }, config_1.configDatas.Jwt.secret, {
            expiresIn: "3d",
        });
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in jwtGenerate:: ", error);
    }
};
exports.gwtGenerate = gwtGenerate;
