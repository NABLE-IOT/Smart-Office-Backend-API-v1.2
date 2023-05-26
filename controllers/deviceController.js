import Device from "../models/Device.js";

const getAllDeviceData = async (req, res, next) => {
  try {
    //read db
    const devices = await Device.find();
    //get response
    res.status(200).json({ devices });
  } catch (error) {
    next(error);
  }
};

const createDevice = async (req, res, next) => {
  try {
    const {
      deviceId,
      deviceName,
      deviceStatus,
      deviceData,
      type,
      location,
      parameter,
    } = req.body;

    // check null values
    if (!deviceId || !deviceName || deviceStatus === "" || !type || !location) {
      res.status(400).send("Please provide all values");
      throw new Error("Please provide all values");
    }

    //check device already exist
    const device = await Device.findOne({
      $or: [{ deviceId: deviceId }, { deviceName: deviceName }],
    });

    //check device already exist
    if (device) {
      res.status(401).send("Device ID or Name already created");
      throw new Error("Device ID or Name already created");
    }

    // create data object
    const data = new Device({
      deviceId: deviceId,
      deviceName: deviceName,
      deviceStatus: deviceStatus,
      type: type,
      location: location,
      deviceData: deviceData,
      timestamp: Date.now(),
      parameter: parameter,
    });

    //save device
    await data.save();

    //get response
    res.status(200).json({ device: data });
  } catch (error) {
    next(error);
  }
};

const updateDevice = async (req, res, next) => {
  const { id } = req.params;
  const { deviceStatus, deviceData, type, location, parameter } = req.body;

  try {
    // Read data from database
    const device = await Device.findOne({ deviceId: id });

    //if not device id found
    if (!device) {
      res.status(404).send(`Device with id ${id} not found`);
      throw new Error(`Device with id ${id} not found`);
    }

    // create data object
    const data = {
      deviceStatus: deviceStatus,
      type: type,
      location: location,
      deviceData: deviceData,
      parameter: parameter,
    };

    //update database
    const updatedDevice = await Device.findOneAndUpdate(
      { deviceId: id },
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ device: updatedDevice });
  } catch (error) {
    next(error);
  }
};

const deleteDevice = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Read data from db
    const device = await Device.findOne({ deviceId: id });

    //check deice available or not
    if (!device) {
      res.status(404).send(`Device with id ${id} not found`);
      throw new Error(`Device with id ${id} not found`);
    }

    // device remove from database
    await Device.deleteOne({ deviceId: id });

    //get response msg
    res.status(200).json({ msg: "Device removed successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllSingleDeviceData = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Read data from database
    const device = await Device.findOne({ deviceId: id });

    if (!device) {
      res.status(404).send(`Device with id ${id} not found`);
      throw new Error(`Device with id ${id} not found`);
    }

    res.status(200).json({ device });
  } catch (error) {
    next(error);
  }
};

export {
  createDevice,
  getAllDeviceData,
  updateDevice,
  deleteDevice,
  getAllSingleDeviceData,
};
