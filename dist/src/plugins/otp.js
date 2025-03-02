"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = exports.otp = void 0;
const otp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};
exports.otp = otp;
const getRandomNumber = (max) => {
    return Math.floor(Math.random() * (max + 1));
};
exports.getRandomNumber = getRandomNumber;
