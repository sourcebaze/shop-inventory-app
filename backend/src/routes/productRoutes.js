import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { productSchema } from "../validators/schemas.js";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
} from "../controllers/productController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const r = Router();
r.use(authenticate);
r.get("/", asyncHandler(listProducts));
r.get("/:id", asyncHandler(getProduct));
r.post(
  "/",
  authorize("owner", "manager"),
  validate(productSchema),
  asyncHandler(createProduct),
);
r.put(
  "/:id",
  authorize("owner", "manager"),
  validate(productSchema),
  asyncHandler(updateProduct),
);
r.delete("/:id", authorize("owner", "manager"), asyncHandler(deleteProduct));
r.patch("/:id/restore", authorize("owner"), asyncHandler(restoreProduct));
export default r;
