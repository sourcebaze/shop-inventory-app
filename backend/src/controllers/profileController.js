import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { success, failure } from "../utils/api.js";
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (req.body.fullName) user.fullName = req.body.fullName;
  if (req.body.email) user.email = req.body.email.toLowerCase();
  if (req.body.password)
    user.password = await bcrypt.hash(req.body.password, 12);
  try {
    await user.save();
  } catch (e) {
    if (e.code === 11000) return failure(res, 409, "Email is already in use");
    throw e;
  }
  const safe = user.toObject();
  delete safe.password;
  success(res, 200, "Profile updated", { user: safe });
};
