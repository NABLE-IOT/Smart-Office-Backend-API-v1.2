import mongoose from "mongoose";

const connectBD = (url) => {
  return mongoose.connect(url);
};

export default connectBD;
