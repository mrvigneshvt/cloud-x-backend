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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeScheduler = void 0;
const config_1 = require("../../../config");
const fetchApi_1 = require("./fetchApi");
const ApiCache_1 = require("../../DataCache/ApiCache");
const otp_1 = require("../otp");
const TimeScheduler = () => __awaiter(void 0, void 0, void 0, function* () {
    yield refreshApiDatas();
    const currentTime = new Date();
    const endOfDay = new Date(currentTime);
    endOfDay.setHours(23, 59, 59, 59); // Set to midnight of the next day
    const delay = endOfDay.getTime() - currentTime.getTime(); // Calculate milliseconds until EOD
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        yield refreshApiDatas();
        setTimeout(() => {
            (0, exports.TimeScheduler)();
        }, 90000);
    }), delay);
});
exports.TimeScheduler = TimeScheduler;
const refreshApiDatas = () => __awaiter(void 0, void 0, void 0, function* () {
    const args = {
        topRated: {
            url: config_1.configDatas.TmdbApi.apiEndPoint.topRated,
            page: (0, otp_1.getRandomNumber)(5),
        },
        nowPlaying: {
            url: config_1.configDatas.TmdbApi.apiEndPoint.nowPlaying,
            page: (0, otp_1.getRandomNumber)(5),
        },
        popular: {
            url: config_1.configDatas.TmdbApi.apiEndPoint.popular,
            page: (0, otp_1.getRandomNumber)(5),
        },
    };
    ApiCache_1.ApiCache.topRated = yield (0, fetchApi_1.fetchTMDBapi)(args.topRated);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            ApiCache_1.ApiCache.nowPlaying = yield (0, fetchApi_1.fetchTMDBapi)(args.nowPlaying);
        }
        catch (error) {
            ApiCache_1.ApiCache.nowPlaying = yield (0, fetchApi_1.fetchTMDBapi)(args.nowPlaying);
        }
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                ApiCache_1.ApiCache.popular = yield (0, fetchApi_1.fetchTMDBapi)(args.popular);
            }
            catch (error) {
                ApiCache_1.ApiCache.popular = yield (0, fetchApi_1.fetchTMDBapi)(args.popular);
            }
        }), 2000);
    }), 1500);
    // ApiCache.trending = await fetchTMDBapi(
    //   configDatas.TmdbApi.apiEndPoint.trendingMovies
    // );
});
