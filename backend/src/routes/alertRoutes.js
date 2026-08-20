import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { alerts, markRead } from "../controllers/alertController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.get("/", asyncHandler(alerts));
r.patch("/read", asyncHandler(markRead));
export default r;
