import express from "express";
const router = express.Router();

import {
  createDevice,
  getAllDeviceData,
  updateDevice,
  deleteDevice,
  getAllSingleDeviceData,
} from "../controllers/deviceController.js";

router.route("/").post(createDevice).get(getAllDeviceData);
router
  .route("/:id")
  .put(updateDevice)
  .delete(deleteDevice)
  .get(getAllSingleDeviceData);

export default router;
