import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { saleSchema } from "../validators/schemas.js";
import {
  createSale,
  listSales,
  getSale,
} from "../controllers/salesController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.post(
  "/",
  authorize("owner", "manager", "staff"),
  validate(saleSchema),
  asyncHandler(createSale),
);
r.get("/", authorize("owner", "manager", "staff"), asyncHandler(listSales));
r.get("/:id", authorize("owner", "manager", "staff"), asyncHandler(getSale));
export default r;
