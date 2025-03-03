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
exports.localOtpCache = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("../../config");
const OtpAuth_1 = require("./interRoute/OtpAuth");
const jwt_1 = require("../plugins/jwt");
const authJwt_1 = require("../plugins/authJwt");
const ApiCache_1 = require("../DataCache/ApiCache");
const streamCache_1 = require("../DataCache/streamCache");
const fetch_1 = require("../plugins/fetch");
const errorLogger_1 = require("../../ERROR-LOGGER/errorLogger");
const Base_1 = require("./Base Route/Base");
const router = express_1.default.Router();
exports.router = router;
// Sample GET request
router.get("/ai", authJwt_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user, "usssser"); // if the USer is Authenticated
    res.status(200).json({
        message: "AI Server is running!",
    });
}));
router.get("/watchOnline/uniqueHash/:hash", (0, authJwt_1.authenticateJwt)({}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hash } = req.params;
        const isCached = yield (0, streamCache_1.getCacheStream)(hash);
        if (isCached) {
            return res.status(201).json(isCached);
        }
        const apiEndPoint = "http://156.67.105.219:4000/api/uniqueHash/" + hash;
        if (ApiCache_1.StreamCache.MovieHash[hash]) {
            return res.status(201).json(ApiCache_1.StreamCache.MovieHash[hash]);
        }
        const request = yield fetch(apiEndPoint, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        if (request.ok) {
            const response = yield request.json();
            (0, streamCache_1.cacheStreamData)(hash, response.data);
            return res.status(201).json(response);
        }
        else {
            return res.status(404).json({ message: "File NOT FOUND" });
        }
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in WATCH-ONLINE:::", error);
    }
}));
router.get("/fetchQuery/:query", (0, authJwt_1.authenticateJwt)({ handleSearch: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.params;
        const repQuery = query.replaceAll("_", "%20");
        const endPoint = `https://api.themoviedb.org/3/search/movie?query=${repQuery}`;
        const response = yield (0, fetch_1.fetchWithRetry)(endPoint, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: config_1.configDatas.TmdbApi.key,
            },
        });
        if (!response) {
            return res
                .status(500)
                .json({ message: "Failed to fetch data after retries" });
        }
        if (!response.results || response.results.length < 1) {
            return res.status(404).json({ message: "not-found" });
        }
        const formattedResponse = response.results.map((d) => {
            var _a;
            return ({
                id: d.id,
                title: d.title,
                releaseYear: ((_a = d.release_date) === null || _a === void 0 ? void 0 : _a.slice(0, 4)) || "Unknown",
                popular: d.popularity,
                poster: d.poster_path
                    ? config_1.configDatas.TmdbApi.imageEndPoint + d.poster_path
                    : config_1.configDatas.imageNotFound.url,
            });
        });
        return res.status(200).json(formattedResponse);
    }
    catch (error) {
        console.error("Final Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/home", (0, authJwt_1.authenticateJwt)({ addUser: true }), Base_1.homeRoute);
router.get("/getMovieinfo/:id", (0, authJwt_1.authenticateJwt)({ handleMovieLookup: true }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const endPoint = config_1.configDatas.TmdbApi.apiEndPoint.getMovieinfo + id;
        const isCached = yield (0, streamCache_1.getMovieCache)(Number(id));
        if (isCached) {
            return res.status(200).json(isCached);
        }
        function checkNfetch() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const respose = yield fetch(endPoint, {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            Authorization: config_1.configDatas.TmdbApi.key,
                        },
                    });
                    if (respose.ok) {
                        const Response = yield respose.json();
                        // Ensure backdrop_path and poster_path are not null
                        Response.backdrop_path = Response.backdrop_path
                            ? config_1.configDatas.TmdbApi.imageEndPoint + Response.backdrop_path
                            : config_1.configDatas.imageNotFound.url;
                        Response.poster_path = Response.poster_path
                            ? config_1.configDatas.TmdbApi.imageEndPoint + Response.poster_path
                            : config_1.configDatas.imageNotFound.url;
                        yield (0, streamCache_1.setMovieCache)(Number(id), Response);
                        return res.status(200).json(Response);
                    }
                    else {
                        return res
                            .status(500)
                            .json({ success: false, message: "apiFailure" });
                    }
                }
                catch (error) {
                    yield checkNfetch();
                }
            });
        }
        yield checkNfetch();
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in single GetMovieInfo::", error);
    }
}));
router.get("/fileAvailable/:fileName", (0, authJwt_1.authenticateJwt)({}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("looking for files?");
        const { fileName } = req.params;
        const endPoint = config_1.configDatas.openXapi.isExistEndPoint + `${fileName}/1`;
        const request = yield fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (request.ok) {
            const respose = yield request.json();
            console.log("req.ok");
            return res.status(200).json(respose);
        }
        else {
            console.log("req.NOok");
            return res.status(request.status).json({ message: "error not found" });
        }
    }
    catch (error) {
        (0, errorLogger_1.errorLogger)("error in fileAvailableRoute::", error);
    }
}));
router.get("/welcome/mainboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
let localOtpCache = {};
exports.localOtpCache = localOtpCache;
router.post("/auth/otpverify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number, otp } = req.body;
    if (!localOtpCache[number]) {
        return res.status(400).json({ success: false, message: "TIMEOUT" });
    }
    else if (localOtpCache[number] !== otp) {
        return res.status(401).json({ success: false, message: "INVALID" });
    }
    const jwtToken = (0, jwt_1.gwtGenerate)(number);
    res.cookie("authToken", jwtToken, {
        httpOnly: true, // Prevents access via JavaScript
        maxAge: 60 * 60 * 1000 * 48, // Cookie expires in 48 hours
        domain: config_1.configDatas.client.ip,
    });
    if (localOtpCache[number]) {
        delete localOtpCache[number];
    }
    // Redirect to homepage
    return res.status(201).json({
        success: true,
        message: "OTP verified. Redirecting to homepage...",
    });
}));
router.post("/auth/whatsapp", OtpAuth_1.WhatsAuth);
router.get("/logout", (0, authJwt_1.authenticateJwt)({}), Base_1.logout);
