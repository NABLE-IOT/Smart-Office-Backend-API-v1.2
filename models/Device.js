import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    require: true,
  },

  deviceName: {
    type: String,
    require: true,
  },

  deviceStatus: {
    type: Boolean,
    require: true,
  },

  type: {
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

  parameter: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Devices", DeviceSchema);
