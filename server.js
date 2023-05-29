import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// database connection
import connectBD from "./db/connect.js";

//import alarms
import { AlarmHandler } from "./utils/alarmHandler.js";

//routes import
import authRouter from "./routes/authRoutes.js";
import deviceRouter from "./routes/deviceRoutes.js";

//crone job import
import usersCleanJob from "./utils/UserCleanJob.js";

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/device", deviceRouter);

//call alarms
AlarmHandler();

//set alarm handler function
const alarmRunOnTime = () => {
  setInterval(() => {
    AlarmHandler();
  }, 10000);
};

alarmRunOnTime();

// Define a route for the verify URL
app.get("/verify?:id", (req, res) => {
  res.sendFile(__dirname + "/verify.html");
});

//user crone job running every month 1st day
cron.schedule("0 0 1 * *", () => {
  console.log("running a task...");
  usersCleanJob();
});

//define port
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectBD(process.env.MONGO_URL);

    app.listen(port, () => {
      console.log(`Server Is Listening Port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
