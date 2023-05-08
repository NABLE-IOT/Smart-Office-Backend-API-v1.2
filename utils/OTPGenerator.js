const generateOtp = () => {
  let OTP = "";
  for (let i = 0; i < 5; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  return OTP;
};

export { generateOtp };
