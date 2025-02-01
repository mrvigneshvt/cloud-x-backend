"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAuth = void 0;
const otp_1 = require("../../plugins/otp");
const config_1 = require("../../../config");
const route_1 = require("../route");
const WhatsAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req, "reqqqq");
        // console.log(req.user, "req-userrr");
        if (req.body.phone.length < 5) {
            return res.status(400).json({
                message: "invalid length",
            });
        }
        const generateOtp = (0, otp_1.otp)();
        //console.log(req.body);
        const suffixAddress = req.body.phone + "@c.us";
        const authMessage = ` Hey Your Authentication Code for Cloud X is -> *${generateOtp}*`;
        const body = JSON.stringify({
            text: authMessage,
            user: suffixAddress,
        });
        console.log(body, "boo");
        console.log("firing", suffixAddress, "   ", authMessage);
        const sendAuthCode = yield fetch(config_1.configDatas.WhatsAuth.apiUrl, {
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
        route_1.localOtpCache[req.body.phone] = generateOtp;
        setTimeout(() => {
            if (route_1.localOtpCache[req.body.phone]) {
                delete route_1.localOtpCache[req.body.phone]; //clearing the cache
            }
            else {
                return;
            }
        }, 60000 + 60000 + 60000);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.log("error in WhatsAuth  ", error);
    }
});
exports.WhatsAuth = WhatsAuth;
