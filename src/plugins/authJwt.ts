import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { configDatas } from "../../config";
import { errorLogger } from "../../ERROR-LOGGER/errorLogger";
import { DB } from "../server";

interface middlewareType {
  addUser?: boolean;
  handleSearch?: boolean;
  handleMovieLookup?: boolean;
}

export const authenticateJwt =
  (args: middlewareType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.authToken; // Read OUR AUTH token from cookies

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
      return; // Ensure function exits here
    }

    try {
      let decoded:
        | {
            id: string;
            iat: number;
            exp: number;
          }
        | any = jwt.verify(token, configDatas.Jwt.secret); // Verify the token
      if (decoded && typeof decoded === "object" && decoded.id) {
        (req as any).user = decoded; // Attach to `req.user`

        console.log(await DB.getUser(decoded.id));
        if (args.addUser) {
          await DB.isUserExist(decoded.id);
        } else if (args.handleSearch) {
          await DB.handleSearchQuery(decoded.id, req.params.query);
        } else if (args.handleMovieLookup) {
          await DB.handleMovieLookUp(decoded.id, req.params.id);
        }
      }
      next(); // Proceed to the next middleware
    } catch (error: unknown) {
      errorLogger("error in AuthJWT::", error);
      console.error("JWT authentication failed:", error);
      res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token" });
      return; // Ensure function exits here
    }
  };
