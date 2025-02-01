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

const router: any = express.Router();

router.get("/logout", authenticateJwt, async (req: Request, res: Response) => {
  res.clearCookie("authToken", {
    path: "/", // Ensure it matches the original cookie path
    httpOnly: true, // If the cookie was set as httpOnly
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "strict", // Adjust based on your use case
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// Sample GET request
router.get("/ai", authenticateJwt, async (req: any, res: Response) => {
  console.log(req, "reqqqq");
  console.log(req.user, "usssser");
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
      console.log(StreamCache);

      if (isCached) {
        console.log("got from cache");
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
        console.log(StreamCache);
        return res.status(201).json(response);
      } else {
        return res.status(404).json({ message: "File NOT FOUND" });
      }
    } catch (error) {
      console.log("error in WATCH-ONLINE:::", error);
    }
  }
);

router.get(
  "/fetchQuery/:query",
  authenticateJwt,
  async (req: Request, res: Response) => {
    try {
      const { query }: any = req.params;
      const repQuery = query.replaceAll("_", "%20");
      const endPoint = `https://api.themoviedb.org/3/search/movie?query=${repQuery}`;

      console.log("Fetching:", endPoint);

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
        console.log("not found");
        return res.status(404).json({ message: "not-found" });
      }

      const formattedResponse = response.results.map((d: any) => ({
        id: d.id,
        title: d.title,
        releaseYear: d.release_date?.slice(0, 4) || "Unknown",
        popular: d.popularity > 5.9,
        poster: d.poster_path
          ? configDatas.TmdbApi.imageEndPoint + d.poster_path
          : configDatas.imageNotFound.url,
      }));

      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error("Final Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/home", authenticateJwt, async (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json([ApiCache.nowPlaying, ApiCache.popular, ApiCache.topRated]);
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/getMovieinfo/:id",
  authenticateJwt,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const endPoint = configDatas.TmdbApi.apiEndPoint.getMovieinfo + id;
      console.log(endPoint);
      const isCached = await getMovieCache(Number(id));
      console.log(TmdbApiCache);
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

        console.log(Response);

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
        console.log(respose);
        return res.status(500).json({ success: false, message: "apiFailure" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/fileAvailable/:fileName",
  authenticateJwt,
  async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;

      console.log("comes here");

      const endPoint = configDatas.openXapi.isExistEndPoint + `${fileName}/1`;

      console.log(endPoint);

      const request = await fetch(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (request.ok) {
        const respose = await request.json();
        console.log(respose);
        return res.status(200).json(respose);
      } else {
        console.log(request);
        return res.status(request.status).json({ message: "error not found" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
router.get("/welcome/mainboard", async (req: Request, res: Response) => {});

let localOtpCache: Record<string, string> = {};

router.post("/auth/otpverify", async (req: Request, res: Response) => {
  const { number, otp } = req.body;

  if (!localOtpCache[number]) {
    console.log("TIMEOUT");
    return res.status(400).json({ success: false, message: "TIMEOUT" });
  } else if (localOtpCache[number] !== otp) {
    console.log("INVALID");

    return res.status(401).json({ success: false, message: "INVALID" });
  }

  console.log("GOOD");

  const jwtToken = gwtGenerate(number);

  console.log(jwtToken, "jwttttttttttttttttttttttttttttS");

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

export { router, localOtpCache };
