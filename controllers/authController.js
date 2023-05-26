import User from "../models/User.js";
import { mailTransport } from "../utils/Mail.js";
import { generateOtp } from "../utils/OTPGenerator.js";
import bcrypt from "bcryptjs";

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    //check null values
    if (!userName || !password || !email) {
      res.status(400).send("Please provide all values");
      throw new Error("Please provide all values");
    }

    //check email already exist
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      res.status(400).send("Email is already exists");
      throw new Error("Email is already exists");
    }

    // create data object
    const user = new User({
      userName: userName,
      email: email,
      password: password,
      createdAt: new Date(),
      isVerify: false,
    });

    //save user
    await user.save();

    //sent email
    await mailTransport(email, userName, user._id);

    //get response
    user.password = undefined;
    res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { userNameOrEmail, password } = req.body;

    //check null values
    if (!userNameOrEmail || !password) {
      res.status(400).send("Please provide all values");
      throw new Error("Please provide all values");
    }

    // Read data from file
    const user = await User.findOne({
      $or: [{ email: userNameOrEmail }, { userName: userNameOrEmail }],
    }).select("+password");

    //check user available or not
    if (!user) {
      res.status(401).send("Invalid Credentials");
      throw new Error("Invalid Credentials");
    }

    //check user verified
    if (!user.isVerify) {
      res.status(401).send("Please verify user");
      throw new Error("Please verify user");
    }

    //check password correct
    const isPasswordCorrect = await user.comparePassword(password);

    //check password correct
    if (!isPasswordCorrect) {
      res.status(401).send("Invalid Password");
      throw new Error("Invalid Password");
    }

    user.password = undefined;
    res.status(200).json({ user: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, password, role } = req.body;

    // Read data from database
    const user = await User.findOne({ _id: id }).select("+password");

    //check user available or not
    if (!user) {
      res.status(404).send(`User with id ${id} not found`);
      throw new Error(`User with id ${id} not found`);
    }

    //check user verified
    if (!user.isVerify) {
      res.status(401).send("Please verify user");
      throw new Error("Please verify user");
    }

    // password bcrypt password
    const salt = await bcrypt.genSalt(10);
    let pass;

    if (password) {
      pass = await bcrypt.hash(password, salt);
    }

    const obj = {
      password: pass,
      userName: userName,
      role: role,
    };

    //update database
    const updatedUser = await User.findOneAndUpdate({ _id: id }, obj, {
      new: true,
      runValidators: true,
    });

    // get respond
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Read data from db
    const user = await User.findOne({ _id: id });

    //check user available or not
    if (!user) {
      res.status(404).send(`User with id ${id} not found`);
      throw new Error(`User with id ${id} not found`);
    }

    // user remove from database
    await User.deleteOne({ _id: id });

    //get response msg
    res.status(200).json({ msg: "User removed successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    //read db
    const users = await User.find();
    //get response
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Read data from db
    const user = await User.findOne({ _id: id });

    //check data user available
    if (!user) {
      res.status(401).send("Invalid Credentials");
      throw new Error("Invalid Credentials");
    }

    //check user id
    if (!user._id) {
      res.status(404).send(`User with id ${id} not found`);
      throw new Error(`User with id ${id} not found`);
    }

    //check already verify or not
    if (user.isVerify) {
      res.status(401).send("User already verified");
      throw new Error("User already verified");
    }

    //update database
    const VerifiedUser = await User.findOneAndUpdate(
      { _id: id },
      { isVerify: true },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ user: VerifiedUser });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    //get email from request
    const { email } = req.body;

    let OTP = generateOtp();

    //check null values
    if (!email) {
      res.status(400).send("Please provide email");
      throw new Error("Please provide all email");
    }

    // Read data from database
    const user = await User.findOne({ email: email }).select("+password");

    //check user available or not
    if (!user) {
      res.status(401).send("Invalid Credentials");
      throw new Error("Invalid Credentials");
    }

    //check already verify or not
    if (!user.isVerify) {
      res.status(401).send("User not verified");
      throw new Error("User not verified");
    }

    // password bcrypt password
    const salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(OTP, salt);

    //create user obj
    const obj = {
      password: pass,
    };

    //update database
    await User.findOneAndUpdate({ _id: user._id }, obj, {
      new: true,
      runValidators: true,
    });

    //sent mail
    await mailTransport(email, user.userName, user._id, OTP);

    res.status(200).json({ msg: `Reset ${user.userName}'s password` });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  updateUser,
  deleteUser,
  getAllUser,
  verifyEmail,
  forgetPassword,
};
