import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { updateProfile } from "../controllers/profileController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.put("/", asyncHandler(updateProfile));
export default r;
