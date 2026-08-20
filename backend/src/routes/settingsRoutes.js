import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import { validate } from "../middleware/validate.js";
import { settingsSchema } from "../validators/schemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.get("/", asyncHandler(getSettings));
r.put(
  "/",
  authorize("owner"),
  validate(settingsSchema),
  asyncHandler(updateSettings),
);
export default r;
