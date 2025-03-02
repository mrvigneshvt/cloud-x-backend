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
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const errorLogger_1 = require("../../ERROR-LOGGER/errorLogger");
const server_1 = require("../server");
const authenticateJwt = (args) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.authToken; // Read OUR AUTH token from cookies
    if (!token) {
        res
            .status(401)
            .json({ success: false, message: "Unauthorized: No token provided" });
        return; // Ensure function exits here
    }
    try {
        let decoded = jsonwebtoken_1.default.verify(token, config_1.configDatas.Jwt.secret); // Verify the token
        if (decoded && typeof decoded === "object" && decoded.id) {
            req.user = decoded; // Attach to `req.user`
            console.log(yield server_1.DB.getUser(decoded.id));
            if (args.addUser) {
                yield server_1.DB.isUserExist(decoded.id);
            }
            else if (args.handleSearch) {
                yield server_1.DB.handleSearchQuery(decoded.id, req.params.query);
            }
            else if (args.handleMovieLookup) {
                yield server_1.DB.handleMovieLookUp(decoded.id, req.params.id);
            }
        }
        next(); // Proceed to the next middleware
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in AuthJWT::", error);
        console.error("JWT authentication failed:", error);
        res
            .status(403)
            .json({ success: false, message: "Forbidden: Invalid token" });
        return; // Ensure function exits here
    }
});
exports.authenticateJwt = authenticateJwt;
