import { Request, Response } from "express";
import { otp } from "../../plugins/otp";
import { configDatas } from "../../../config";
import { text } from "body-parser";
import { localOtpCache } from "../route";

export const WhatsAuth = async (req: any, res: Response) => {
  try {
    // console.log(req, "reqqqq");
    // console.log(req.user, "req-userrr");
    if (req.body.phone.length < 5) {
      return res.status(400).json({
        message: "invalid length",
      });
    }
    const generateOtp: string = otp();

    //console.log(req.body);

    const suffixAddress = req.body.phone + "@c.us";
    const authMessage = ` Hey Your Authentication Code for Cloud X is -> *${generateOtp}*`;
    const body = JSON.stringify({
      text: authMessage,
      user: suffixAddress,
    });

    console.log(body, "boo");

    console.log("firing", suffixAddress, "   ", authMessage);
    const sendAuthCode = await fetch(configDatas.WhatsAuth.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the server knows it's JSON
      },
      body,
    });

    console.log(sendAuthCode);

    if (sendAuthCode.status !== 200) {
      return res.status(404).json({ message: "issue in sending otp" });
    }

    localOtpCache[req.body.phone] = generateOtp;

    setTimeout(() => {
      if (localOtpCache[req.body.phone]) {
        delete localOtpCache[req.body.phone]; //clearing the cache
      } else {
        return;
      }
    }, 60000 + 60000 + 60000);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("error in WhatsAuth  ", error);
  }
};
