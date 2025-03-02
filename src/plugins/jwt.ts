import { configDatas } from "../../config";
import jwt from "jsonwebtoken";
import { errorLogger } from "../../ERROR-LOGGER/errorLogger";

export const gwtGenerate = (id: string) => {
  try {
    return jwt.sign({ id }, configDatas.Jwt.secret, {
      expiresIn: "3d",
    });
  } catch (error) {
    errorLogger("error in jwtGenerate:: ", error);
  }
};
