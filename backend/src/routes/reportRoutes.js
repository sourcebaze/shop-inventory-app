import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  dashboard,
  salesReport,
  inventoryReport,
} from "../controllers/reportController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.get("/dashboard", asyncHandler(dashboard));
r.get("/sales", authorize("owner", "manager"), asyncHandler(salesReport));
r.get(
  "/inventory",
  authorize("owner", "manager"),
  asyncHandler(inventoryReport),
);
export default r;
