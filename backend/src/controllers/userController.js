import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { success, failure } from "../utils/api.js";

export const listUsers = async (req, res) =>
  success(res, 200, "Users fetched", {
    users: await User.find().select("-password").sort("-createdAt"),
  });
export const createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  if (await User.exists({ email: email.toLowerCase() }))
    return failure(res, 409, "Email is already registered");
  if (role === "owner" && req.user.role !== "owner")
    return failure(res, 403, "Only an owner can create another owner");
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password || "ChangeMe123!", 12),
    role,
  });
  const safe = user.toObject();
  delete safe.password;
  success(res, 201, "User created", { user: safe });
};
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return failure(res, 404, "User not found");
  success(res, 200, "User fetched", { user });
};
export const updateUser = async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return failure(res, 404, "User not found");
  if (
    target.role === "owner" &&
    req.user._id.toString() !== target._id.toString()
  )
    return failure(res, 403, "Owner accounts are protected");
  if (req.body.role === "owner" && req.user.role !== "owner")
    return failure(res, 403, "Only an owner can assign owner role");
  if (req.body.password)
    req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");
  success(res, 200, "User updated", { user });
};
export const setStatus = async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return failure(res, 404, "User not found");
  if (target.role === "owner")
    return failure(res, 403, "Owner account cannot be deactivated");
  target.isActive = !target.isActive;
  await target.save();
  success(res, 200, `User ${target.isActive ? "activated" : "deactivated"}`, {
    user: target,
  });
};
export const deleteUser = async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return failure(res, 404, "User not found");
  if (target.role === "owner")
    return failure(res, 403, "Owner account cannot be deleted");
  await target.deleteOne();
  success(res, 200, "User deleted");
};
