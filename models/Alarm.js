import mongoose from "mongoose";

const AlarmSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    require: true,
  },

  deviceName: {
    type: String,
    require: true,
  },

  location: {
    type: String,
    require: true,
  },

  deviceData: {
    type: String,
    require: true,
  },

  timestamp: {
    type: Number,
    require: true,
  },

  unit: {
    type: String,
  },

  minPoint: {
    type: String,
  },

  maxPoint: {
    type: String,
  },

  lowLevel: {
    type: String,
  },

  highLevel: {
    type: String,
  },

  alarmType: {
    type: String,
  },

  isEmailSent: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Alarm", AlarmSchema);
