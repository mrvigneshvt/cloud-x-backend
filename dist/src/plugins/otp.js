"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp = void 0;
const otp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
};
exports.otp = otp;
