import express from "express";
const app = express();
import connectDB from "./db/connect.js";
import "express-async-errors";
import {} from "dotenv/config";
import cors from "cors";
connectDB;
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import authRoutes from "./routes/authRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import Authentication from "./middleware/auth.js";

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/jobs", Authentication, jobsRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// app.use();
app.listen(5000, () => {
  console.log("server running on 5000");
});
