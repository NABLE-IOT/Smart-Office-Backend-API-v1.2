import User from "../models/User.js";
import Alarm from "../models/Alarm.js";
import { mailTransport } from "./AlarmMail.js";

import moment from "moment";

const AlarmCheckAndSave = async (deviceData) => {
  try {
    //separate parameters from semicolon
    const param = deviceData.parameter;
    const values = param.split(":");

    //assign value
    const unit = values[0].trim();
    const minPoint = values[1];
    const maxPoint = values[2];
    const lowLevel = values[3];
    const highLevel = values[4];
    const sensorValue = deviceData.deviceData;

    let alarmObj = {};

    //check o2 conditions
    if (deviceData.deviceName === "O2" && sensorValue <= lowLevel) {
      // create data object
      alarmObj = new Alarm({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        location: deviceData.location,
        deviceData: sensorValue,
        timestamp: Date.now(),
        unit: unit,
        minPoint: minPoint,
        maxPoint: maxPoint,
        lowLevel: lowLevel,
        highLevel: highLevel,
        alarmType: "Critical",
      });
    } else if (deviceData.deviceName === "O2" && sensorValue >= highLevel) {
      // create data object
      alarmObj = new Alarm({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        location: deviceData.location,
        deviceData: sensorValue,
        timestamp: Date.now(),
        unit: unit,
        minPoint: minPoint,
        maxPoint: maxPoint,
        lowLevel: lowLevel,
        highLevel: highLevel,
        alarmType: "Warning",
      });
    }

    //check Temperature conditions
    if (deviceData.deviceName === "Temperature" && sensorValue >= highLevel) {
      // create data object
      alarmObj = new Alarm({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        location: deviceData.location,
        deviceData: sensorValue,
        timestamp: Date.now(),
        unit: unit,
        minPoint: minPoint,
        maxPoint: maxPoint,
        lowLevel: lowLevel,
        highLevel: highLevel,
        alarmType: "Critical",
      });
    } else if (
      deviceData.deviceName === "Temperature" &&
      sensorValue <= lowLevel
    ) {
      // create data object
      alarmObj = new Alarm({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        location: deviceData.location,
        deviceData: sensorValue,
        timestamp: Date.now(),
        unit: unit,
        minPoint: minPoint,
        maxPoint: maxPoint,
        lowLevel: lowLevel,
        highLevel: highLevel,
        alarmType: "Warning",
      });
    }

    //check Humidity conditions
    if (deviceData.deviceName === "Humidity" && sensorValue <= lowLevel) {
      // create data object
      alarmObj = new Alarm({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        location: deviceData.location,
        deviceData: sensorValue,
        timestamp: Date.now(),
        unit: unit,
        minPoint: minPoint,
        maxPoint: maxPoint,
        lowLevel: lowLevel,
        highLevel: highLevel,
        alarmType: "Critical",
      });
    } else if (
      deviceData.deviceName === "Humidity" &&
      sensorValue >= highLevel
    ) {
      // create data object
      alarmObj = new Alarm({
        deviceId: deviceData.deviceId,
        deviceName: deviceData.deviceName,
        location: deviceData.location,
        deviceData: sensorValue,
        timestamp: Date.now(),
        unit: unit,
        minPoint: minPoint,
        maxPoint: maxPoint,
        lowLevel: lowLevel,
        highLevel: highLevel,
        alarmType: "Warning",
      });
    }

    //save alarm
    await alarmObj.save();
  } catch (error) {
    Error(error);
  }
};

const AlarmHandler = async (req, res, next) => {
  try {
    console.log("Running Alarm...");

    const currentTime = new Date();
    const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000);
    const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

    const lastAlarmOneHourAgo = await Alarm.findOne({
      timestamp: { $lt: Number(twoMinutesAgo) },
    }).sort({ timestamp: -1 });

    const latestAlarm = await Alarm.findOne().sort({ timestamp: -1 });
    const checkDB = await Alarm.find();

    if (
      lastAlarmOneHourAgo &&
      !lastAlarmOneHourAgo.isEmailSent &&
      lastAlarmOneHourAgo.deviceData !== latestAlarm.deviceData &&
      !latestAlarm.isEmailSent
    ) {
      //sent email
      sendEmail(
        latestAlarm.deviceName,
        latestAlarm.location,
        latestAlarm.deviceData,
        moment(latestAlarm.timestamp).format("MMMM Do YYYY, h:mm:ss a"),
        latestAlarm.unit,
        latestAlarm.alarmType
      );

      console.log("email send..");

      await Alarm.updateMany(
        { isEmailSent: false },
        { $set: { isEmailSent: true } },
        {
          new: true,
          runValidators: true,
        }
      );
    } else if (checkDB.length <= 1 && !latestAlarm.isEmailSent) {
      //sent email
      sendEmail(
        latestAlarm.deviceName,
        latestAlarm.location,
        latestAlarm.deviceData,
        moment(latestAlarm.timestamp).format("MMMM Do YYYY, h:mm:ss a"),
        latestAlarm.unit,
        latestAlarm.alarmType
      );
      console.log("email send..");

      await Alarm.findOneAndUpdate(
        { _id: latestAlarm._id },
        { isEmailSent: true },
        {
          new: true,
          runValidators: true,
        }
      );
    }
  } catch (error) {
    Error(error);
  }
};

const sendEmail = async (
  deviceName,
  location,
  deviceData,
  timestamp,
  unit,
  alarmType
) => {
  try {
    const users = await User.find();

    for (let i = 0; i < users.length; i++) {
      if (users[i].isEmail) {
        await mailTransport(
          users[i].email,
          deviceName,
          location,
          deviceData,
          timestamp,
          unit,
          alarmType
        );
      }
    }
  } catch (error) {
    Error(error);
  }
};

export { AlarmHandler, AlarmCheckAndSave };
