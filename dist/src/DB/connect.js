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
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("./model");
const errorLogger_1 = require("../../ERROR-LOGGER/errorLogger");
class DataBase {
    constructor(mongoUri) {
        this.mongo = mongoUri;
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(this.mongo);
                return true;
            }
            catch (error) {
                (0, errorLogger_1.errorLogger)('error in db Connection::"', error);
                throw new Error("Cant be Able to Connect to DB !@! shutting DOWN");
            }
        });
    }
    getUser(uniqueNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model_1.userModel.findOne({ userId: uniqueNumber });
            }
            catch (error) { }
        });
    }
    isUserExist(unqiueNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.userModel.findOne({ userId: unqiueNumber });
                user ? true : yield this.createUser(unqiueNumber);
                return true;
            }
            catch (error) {
                (0, errorLogger_1.errorLogger)("error in UserExist::", error);
                return false;
            }
        });
    }
    createUser(unqiueNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield model_1.userModel.create({ userId: unqiueNumber });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    handleSearchQuery(unqiueNumber, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("handling search in db");
                yield model_1.userModel.findOneAndUpdate({ userId: unqiueNumber }, {
                    $push: {
                        searchHistory: query,
                    },
                });
            }
            catch (error) {
                (0, errorLogger_1.errorLogger)("error in mongo handleSearchQuery::", error);
            }
        });
    }
    handleMovieLookUp(unqiueNumber, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("handling Movie");
                yield model_1.userModel.findOneAndUpdate({ userId: unqiueNumber }, {
                    $push: {
                        watchHistoryMovie: {
                            movieId,
                            watchedAt: new Date(),
                        },
                    },
                });
            }
            catch (error) {
                (0, errorLogger_1.errorLogger)("error in Movielookup", error);
            }
        });
    }
}
exports.default = DataBase;
