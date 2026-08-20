import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { success, failure } from "../utils/api.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const normalized = email.toLowerCase();
  if (await User.exists({ email: normalized }))
    return failure(res, 409, "Email is already registered");
  const role = (await User.countDocuments()) === 0 ? "owner" : "staff";
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email: normalized,
    password: hashed,
    role,
  });
  const safe = user.toObject();
  delete safe.password;
  success(res, 201, "Registration successful", {
    user: safe,
    token: signToken(user),
  });
};

export const login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  }).select("+password");
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return failure(res, 401, "Invalid email or password");
  if (!user.isActive)
    return failure(res, 403, "Your account is inactive. Contact an owner.");
  const safe = user.toObject();
  delete safe.password;
  success(res, 200, "Login successful", { user: safe, token: signToken(user) });
};

export const me = async (req, res) =>
  success(res, 200, "Current user", { user: req.user });
export const logout = async (req, res) =>
  success(res, 200, "Logged out successfully");
