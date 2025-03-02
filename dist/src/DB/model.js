"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    coins: {
        type: Number,
        required: true,
        default: 100,
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false,
    },
    banReason: {
        type: String,
        default: "",
    },
    isPremium: {
        type: Boolean,
        required: true,
        default: false,
    },
    searchHistory: {
        type: [String],
        default: [],
    },
    favoriteMovieList: {
        type: [String], // Array of movie IDs
        default: [],
    },
    watchHistoryMovie: {
        type: [
            {
                movieId: String, // ID of the movie
                watchedAt: Date, // Timestamp when the movie was watched
            },
        ],
        default: [],
    },
}, { timestamps: true });
exports.userModel = mongoose_1.default.model("User", userSchema);
