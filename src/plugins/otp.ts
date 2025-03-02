export const otp = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * (max + 1));
};
