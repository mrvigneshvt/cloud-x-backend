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
exports.DB = void 0;
const express_1 = __importDefault(require("express"));
const route_1 = require("./routes/route");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const tmdbApi_1 = require("./plugins/tmdbApi/tmdbApi");
const config_1 = require("../config");
const connect_1 = __importDefault(require("./DB/connect"));
const errorLogger_1 = require("../ERROR-LOGGER/errorLogger");
const app = (0, express_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: `http://${config_1.configDatas.client.ip}:${config_1.configDatas.client.port}`,
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use("/api", route_1.router);
// Default Route
// Start Server
const PORT = 5000;
exports.DB = new connect_1.default(config_1.configDatas.MongoUri.apiUrl);
app.listen(PORT, "0.0.0.0", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.DB.connectDB();
        yield (0, tmdbApi_1.TimeScheduler)();
        console.log(`Server running on http://localhost:${PORT}`);
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in portLisening::", error);
    }
}));
