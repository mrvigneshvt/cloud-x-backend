import { customAlphabet } from "nanoid";

const otp = () => {
  let otp = Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
  return otp.toString();
};

const some = otp()(async function () {
  console.log(1);
  console.log(some);
  console.log(2);
})();
