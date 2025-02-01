import { configDatas } from "../../config";
import jwt from "jsonwebtoken";

export const gwtGenerate = (id: string) => {
  try {
    return jwt.sign({ id }, configDatas.Jwt.secret, {
      expiresIn: "3d",
    });
  } catch (error) {
    console.log("error in jwtGenerate:: ", error);
  }
};
