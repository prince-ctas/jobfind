import jwt from "jsonwebtoken";
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(404).json("Authentication Invalid");
    next();
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.users = { userId: payload.userId };
      next();
    } catch (error) {
      res.status(404).json("Authentication Invalid");
      next();
    }
  }
};

export default auth;
