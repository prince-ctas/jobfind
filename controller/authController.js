import { StatusCodes } from "http-status-codes";
import BedRequestError from "../errors/bad-request.js";
import UnAuthenticatedError from "../errors/unauthenticated.js";
import user from "../models/User.js";

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BedRequestError("please provide all values");
  }
  const alreadyExists = await user.findOne({ email });
  if (alreadyExists) {
    throw new BedRequestError("Email already use in");
  }
  const users = await user.create({ name, email, password });
  const token = users.createJWT();
  res.status(StatusCodes.OK).json({
    users: {
      email: users.email,
      name: users.name,
      lastname: users.lastname,
      location: users.location,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BedRequestError("please provide all values");
  }
  const users = await user.findOne({ email }).select("+password");
  if (!users) {
    throw new UnAuthenticatedError("invalid Credentials");
  }
  const isPasswordCorrect = await users.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("invalid Credentials");
  }
  const token = users.createJWT();
  users.password = undefined;
  res.status(StatusCodes.OK).json({ users, token, location: users.location });
};

const updateuser = async (req, res, next) => {
  const users = await user.findOneAndUpdate(
    { _id: req.users.userId },
    req.body,
    { new: true }
  );
  const token = await users.createJWT();
  if (token && users) {
    res.status(200).json({ users, token, location: users.location });
  } else {
    res.status(400).json({ message: "Error" });
  }
};

export { register, login, updateuser };
