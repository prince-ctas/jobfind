import { StatusCodes } from "http-status-codes";
import BedRequestError from "../errors/bad-request.js";
import job from "../models/job.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    return res.status(400).json({ message: "please provide all values" });
  } else {
    req.body.createdBy = req.users.userId;
    const jobs = await job.create(req.body);

    if (jobs) {
      res.status(200).send({ jobs });
      return;
    } else {
      res.status(400).json({ message: "Error" });
      return;
    }
  }
};
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  const queryObject = {
    createdBy: req.users.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let result = job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await job.countDocuments(queryObject);

  const numberOfPages = Math.ceil(totalJobs / limit);

  if (jobs) {
    res.status(StatusCodes.OK).json({ jobs, totalJobs, numberOfPages });
    return;
  } else {
    res.status(400).json({ message: "Error" });
    return;
  }
};
const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!position || !company) {
    return res.status(400).json({ message: "please provide all values" });
  }
  const jobs = await job.findOne({ _id: jobId });

  if (!jobs) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }
  // check permissions

  checkPermissions(req.users, jobs.createdBy);

  const updatedJob = await job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const jobs = await job.findOne({ _id: jobId });

  if (!jobs) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }
  // check permissions

  checkPermissions(req.users, jobs.createdBy);

  await jobs.remove();

  res.status(StatusCodes.OK).json({ message: "Success! Job removed" });
};
const showStats = async (req, res) => {
  let stats = await job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.users.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.users.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, getAllJobs, updateJob, deleteJob, showStats };
