import express, { Request, Response } from "express";
import { router } from "./routes/route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { TimeScheduler } from "./plugins/tmdbApi/tmdbApi";
import { configDatas } from "../config";
import DataBase from "./DB/connect";
import { errorLogger } from "../ERROR-LOGGER/errorLogger";

const app = express();

// Middleware

app.use(cookieParser());
app.use(
  cors({
    origin: `http://${configDatas.client.ip}:${configDatas.client.port}`,
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api", router);

// Default Route

// Start Server
const PORT = 5000;
export const DB = new DataBase(configDatas.MongoUri.apiUrl);

app.listen(PORT, "0.0.0.0", async () => {
  try {
    await DB.connectDB();
    await TimeScheduler();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error: unknown) {
    errorLogger("error in portLisening::", error);
  }
});
