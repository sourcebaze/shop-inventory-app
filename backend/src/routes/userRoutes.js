import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userSchema } from "../validators/schemas.js";
import {
  listUsers,
  createUser,
  getUser,
  updateUser,
  setStatus,
  deleteUser,
} from "../controllers/userController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate, authorize("owner"));
r.get("/", asyncHandler(listUsers));
r.post("/", validate(userSchema), asyncHandler(createUser));
r.get("/:id", asyncHandler(getUser));
r.put("/:id", validate(userSchema), asyncHandler(updateUser));
r.patch("/:id/status", asyncHandler(setStatus));
r.delete("/:id", asyncHandler(deleteUser));
export default r;
