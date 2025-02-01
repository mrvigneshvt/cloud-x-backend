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
exports.getMovieCache = exports.setMovieCache = exports.getCacheStream = exports.cacheStreamData = void 0;
const ApiCache_1 = require("./ApiCache");
const cacheStreamData = (hash, url) => __awaiter(void 0, void 0, void 0, function* () {
    ApiCache_1.StreamCache.MovieHash[hash] ? null : (ApiCache_1.StreamCache.MovieHash[hash] = url);
});
exports.cacheStreamData = cacheStreamData;
const getCacheStream = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    if (ApiCache_1.StreamCache.MovieHash[hash]) {
        return ApiCache_1.StreamCache.MovieHash[hash];
    }
    else {
        return false;
    }
});
exports.getCacheStream = getCacheStream;
const setMovieCache = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    ApiCache_1.TmdbApiCache.Movie[id] ? null : (ApiCache_1.TmdbApiCache.Movie[id] = data);
});
exports.setMovieCache = setMovieCache;
const getMovieCache = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (ApiCache_1.TmdbApiCache.Movie[id]) {
        return ApiCache_1.TmdbApiCache.Movie[id];
    }
    else {
        return false;
    }
});
exports.getMovieCache = getMovieCache;
