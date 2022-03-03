import { readFile } from "fs/promises";

import {} from "dotenv/config";
import connectDB from "./db/connect";
import job from "./models/job.js";

const start = async () => {
  try {
    await connectDB("mongodb://localhost:27017/findjob");
    await job.deleteMany();
    const jsonProducts = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    );
    await job.create(jsonProducts);
    console.log("success!!!");
    process.exit[0];
  } catch (error) {
    console.log(error);
    process.exit[1];
  }
};

start();
