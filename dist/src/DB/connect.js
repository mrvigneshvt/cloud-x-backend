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
const config_1 = require("../../config");
const model_1 = require("./model");
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mongoose_1.default.connect(config_1.configDatas.MongoUri.apiUrl);
        if (!connection) {
        }
    }
    catch (error) { }
});
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
                console.log("error in db Connection::", error);
                return false;
            }
        });
    }
    isUserExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.userModel.findOne({ userId: id });
                return user ? true : false;
            }
            catch (error) {
                console.log("error in UserExist::", error);
                return false;
            }
        });
    }
    createUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createUser = yield model_1.userModel.create({ userId: id });
            }
            catch (error) { }
        });
    }
}
