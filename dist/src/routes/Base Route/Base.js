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
exports.homeRoute = exports.logout = void 0;
const express_1 = __importDefault(require("express"));
const ApiCache_1 = require("../../DataCache/ApiCache");
const errorLogger_1 = require("../../../ERROR-LOGGER/errorLogger");
const router = express_1.default.Router();
const logout = (req, res) => {
    try {
        console.log("clearing cookies");
        res.clearCookie("authToken", {
            path: "/", // Ensure it matches the original cookie path
            httpOnly: true, // If the cookie was set as httpOnly
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict", // Adjust based on your use case
        });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server error on LOGOUT" });
    }
};
exports.logout = logout;
const homeRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res
            .status(200)
            .json([ApiCache_1.ApiCache.nowPlaying, ApiCache_1.ApiCache.popular, ApiCache_1.ApiCache.topRated]);
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in homeRoute::", error);
    }
});
exports.homeRoute = homeRoute;
