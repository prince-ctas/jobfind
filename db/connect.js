import mongoose from "mongoose";

const connectDB = mongoose
  .connect("mongodb://localhost:27017/findjob")
  .then(() => {
    console.log("connection success");
  })
  .catch((e) => {
    console.log("no connection");
  });

export default connectDB;
