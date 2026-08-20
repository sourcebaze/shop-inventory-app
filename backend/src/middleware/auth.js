import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { failure } from "../utils/api.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return failure(res, 401, "Authentication required");
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");
    if (!user || !user.isActive)
      return failure(res, 401, "Account is inactive or no longer exists");
    req.user = user;
    next();
  } catch {
    return failure(res, 401, "Invalid or expired token");
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return failure(
        res,
        403,
        "You do not have permission to perform this action",
      );
    next();
  };
