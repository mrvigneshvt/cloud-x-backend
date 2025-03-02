"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = errorLogger;
const fs_1 = __importDefault(require("fs"));
function errorLogger(text, error) {
    const date = new Date();
    const localTime = date.toLocaleString("en-Us", { timeZone: "Asia/Kolkata" });
    fs_1.default.appendFileSync("errorLogs.txt", `ERROR -: ${localTime} :-  ${text} : ${error}` + "\n");
    console.log(text, error);
}
