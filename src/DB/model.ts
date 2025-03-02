import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields automatically
);

export const userModel = mongoose.model("User", userSchema);
