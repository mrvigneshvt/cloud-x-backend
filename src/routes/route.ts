import express, { Request, Response } from "express";
import nano from "nano";
import { otp } from "../plugins/otp";
import { configDatas } from "../../config";
import { WhatsAuth } from "./interRoute/OtpAuth";
import { gwtGenerate } from "../plugins/jwt";
import { authenticateJwt } from "../plugins/authJwt";
import { ApiCache, StreamCache, TmdbApiCache } from "../DataCache/ApiCache";
import {
  cacheStreamData,
  getCacheStream,
  getMovieCache,
  setMovieCache,
} from "../DataCache/streamCache";
import { fetchWithRetry } from "../plugins/fetch";
import { errorLogger } from "../../ERROR-LOGGER/errorLogger";
import { DB } from "../server";
import { homeRoute, logout } from "./Base Route/Base";

const router: any = express.Router();

// Sample GET request
router.get("/ai", authenticateJwt, async (req: any, res: Response) => {
  console.log(req.user, "usssser"); // if the USer is Authenticated
  res.status(200).json({
    message: "AI Server is running!",
  });
});

router.get(
  "/watchOnline/uniqueHash/:hash",
  authenticateJwt,
  async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;
      const isCached = await getCacheStream(hash);

      if (isCached) {
        return res.status(201).json(isCached);
      }
      const apiEndPoint = "http://156.67.105.219:4000/api/uniqueHash/" + hash;

      if (StreamCache.MovieHash[hash]) {
        return res.status(201).json(StreamCache.MovieHash[hash]);
      }

      const request = await fetch(apiEndPoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (request.ok) {
        const response = await request.json();
        cacheStreamData(hash, response.data);
        return res.status(201).json(response);
      } else {
        return res.status(404).json({ message: "File NOT FOUND" });
      }
    } catch (error) {
      errorLogger("error in WATCH-ONLINE:::", error);
    }
  },
);

router.get(
  "/fetchQuery/:query",
  authenticateJwt({ handleSearch: true }),
  async (req: Request, res: Response) => {
    try {
      const { query }: any = req.params;
      const repQuery = query.replaceAll("_", "%20");
      const endPoint = `https://api.themoviedb.org/3/search/movie?query=${repQuery}`;

      const response = await fetchWithRetry(endPoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: configDatas.TmdbApi.key,
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

      const formattedResponse = response.results.map((d: any) => ({
        id: d.id,
        title: d.title,
        releaseYear: d.release_date?.slice(0, 4) || "Unknown",
        popular: d.popularity,
        poster: d.poster_path
          ? configDatas.TmdbApi.imageEndPoint + d.poster_path
          : configDatas.imageNotFound.url,
      }));

      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error("Final Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

router.get("/home", authenticateJwt({ addUser: true }), homeRoute);

router.get(
  "/getMovieinfo/:id",
  authenticateJwt({ handleMovieLookup: true }),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const endPoint = configDatas.TmdbApi.apiEndPoint.getMovieinfo + id;
      const isCached = await getMovieCache(Number(id));
      if (isCached) {
        return res.status(200).json(isCached);
      }
      const respose = await fetch(endPoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: configDatas.TmdbApi.key,
        },
      });

      if (respose.ok) {
        const Response = await respose.json();

        // Ensure backdrop_path and poster_path are not null
        Response.backdrop_path = Response.backdrop_path
          ? configDatas.TmdbApi.imageEndPoint + Response.backdrop_path
          : configDatas.imageNotFound.url;

        Response.poster_path = Response.poster_path
          ? configDatas.TmdbApi.imageEndPoint + Response.poster_path
          : configDatas.imageNotFound.url;
        await setMovieCache(Number(id), Response);
        return res.status(200).json(Response);
      } else {
        return res.status(500).json({ success: false, message: "apiFailure" });
      }
    } catch (error) {
      errorLogger("error in single GetMovieInfo::", error);
    }
  },
);

router.get(
  "/fileAvailable/:fileName",
  authenticateJwt,
  async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;

      const endPoint = configDatas.openXapi.isExistEndPoint + `${fileName}/1`;

      const request = await fetch(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (request.ok) {
        const respose = await request.json();
        return res.status(200).json(respose);
      } else {
        return res.status(request.status).json({ message: "error not found" });
      }
    } catch (error: unknown) {
      errorLogger("error in fileAvailableRoute::", error);
    }
  },
);
router.get("/welcome/mainboard", async (req: Request, res: Response) => {});

let localOtpCache: Record<string, string> = {};

router.post("/auth/otpverify", async (req: Request, res: Response) => {
  const { number, otp } = req.body;

  if (!localOtpCache[number]) {
    return res.status(400).json({ success: false, message: "TIMEOUT" });
  } else if (localOtpCache[number] !== otp) {
    return res.status(401).json({ success: false, message: "INVALID" });
  }

  const jwtToken = gwtGenerate(number);

  res.cookie("authToken", jwtToken, {
    httpOnly: true, // Prevents access via JavaScript
    maxAge: 60 * 60 * 1000 * 48, // Cookie expires in 48 hours
    domain: configDatas.client.ip,
  });

  if (localOtpCache[number]) {
    delete localOtpCache[number];
  }
  // Redirect to homepage
  return res.status(201).json({
    success: true,
    message: "OTP verified. Redirecting to homepage...",
  });
});

router.post("/auth/whatsapp", WhatsAuth);
router.get("/logout", authenticateJwt, logout);

export { router, localOtpCache };
