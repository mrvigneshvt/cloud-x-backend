"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const authenticateJwt = (req, res, next) => {
    //console.log(req);
    //console.log(req);
    const token = req.cookies.authToken;
    console.log(req.cookies); // Read the token from cookies
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.configDatas.Jwt.secret); // Verify the token
        req.user = decoded; // Attach decoded payload to `req.user`
        next(); // Proceed to the next middleware
    }
    catch (error) {
        console.error("JWT authentication failed:", error);
        res
            .status(403)
            .json({ success: false, message: "Forbidden: Invalid token" });
    }
};
exports.authenticateJwt = authenticateJwt;
