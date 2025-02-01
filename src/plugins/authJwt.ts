import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { configDatas } from "../../config";

export const authenticateJwt = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  //console.log(req);
  //console.log(req);
  const token = req.cookies.authToken;
  console.log(req.cookies); // Read the token from cookies

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, configDatas.Jwt.secret); // Verify the token
    req.user = decoded; // Attach decoded payload to `req.user`
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("JWT authentication failed:", error);
    res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid token" });
  }
};
