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
exports.fetchTMDBapi = void 0;
const config_1 = require("../../.././config");
const fetchTMDBapi = (url, series) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: config_1.configDatas.TmdbApi.key,
        },
    };
    try {
        const respose = yield fetch(url, options);
        if (respose.ok) {
            const data = yield respose.json();
            const results = data.results;
            let dataTosend = [];
            let neededResults = (title, poster, releaseDate, id, story, category) => {
                return {
                    title,
                    poster: config_1.configDatas.TmdbApi.imageEndPoint + poster,
                    releaseDate,
                    id,
                    story,
                    category,
                };
            };
            yield results.map((d, i) => {
                if (series) {
                    dataTosend.push(neededResults(d.name, d.backdrop_path, d.first_air_date, d.id, d.overview, "tv"));
                }
                else {
                    dataTosend.push(neededResults(d.title, d.backdrop_path, d.release_date, d.id, d.overview, "movie"));
                }
            });
            return dataTosend;
        }
        console.log(respose.status);
    }
    catch (error) {
        (0, exports.fetchTMDBapi)(url);
        console.log(error);
    }
});
exports.fetchTMDBapi = fetchTMDBapi;
(0, exports.fetchTMDBapi)(config_1.configDatas.TmdbApi.apiEndPoint.topRated);
