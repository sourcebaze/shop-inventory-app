import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { stockSchema, adjustmentSchema } from "../validators/schemas.js";
import {
  stockIn,
  stockOut,
  adjustStock,
  history,
} from "../controllers/stockController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.get("/history", authorize("owner", "manager"), asyncHandler(history));
r.post(
  "/in",
  authorize("owner", "manager"),
  validate(stockSchema),
  asyncHandler(stockIn),
);
r.post(
  "/out",
  authorize("owner", "manager"),
  validate(stockSchema),
  asyncHandler(stockOut),
);
r.post(
  "/adjust",
  authorize("owner", "manager"),
  validate(adjustmentSchema),
  asyncHandler(adjustStock),
);
export default r;
