import express, { Request, Response } from "express";
import { authenticateJwt } from "../../plugins/authJwt";
import { ApiCache } from "../../DataCache/ApiCache";
import { errorLogger } from "../../../ERROR-LOGGER/errorLogger";

const router = express.Router();

export const logout = (req: Request, res: Response): Response => {
  try {
    res.clearCookie("authToken", {
      path: "/", // Ensure it matches the original cookie path
      httpOnly: true, // If the cookie was set as httpOnly
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict", // Adjust based on your use case
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error on LOGOUT" });
  }
};

export const homeRoute = async (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json([ApiCache.nowPlaying, ApiCache.popular, ApiCache.topRated]);
  } catch (error) {
    errorLogger("error in homeRoute::", error);
  }
};
