import express from "express";
const router = express.Router();

import {
  register,
  login,
  updateUser,
  deleteUser,
  getAllUser,
  verifyEmail,
  forgetPassword,
} from "../controllers/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update-profile/:id").put(updateUser);
router.route("/delete-user/:id").delete(deleteUser);
router.route("/users").get(getAllUser);
router.route("/verify/:id").put(verifyEmail);
router.route("/forget-password").post(forgetPassword);

export default router;
