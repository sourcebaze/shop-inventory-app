import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  categorySchema,
  supplierSchema,
  customerSchema,
} from "../validators/schemas.js";
import {
  category,
  supplier,
  customer,
} from "../controllers/catalogController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const make = (handlers, schema) => {
  const r = Router();
  r.use(authenticate);
  r.get("/", asyncHandler(handlers.list));
  r.post(
    "/",
    authorize("owner", "manager"),
    validate(schema),
    asyncHandler(handlers.create),
  );
  r.put(
    "/:id",
    authorize("owner", "manager"),
    validate(schema),
    asyncHandler(handlers.update),
  );
  r.delete(
    "/:id",
    authorize("owner", "manager"),
    asyncHandler(handlers.remove),
  );
  return r;
};
export const categoryRoutes = make(category, categorySchema);
export const supplierRoutes = make(supplier, supplierSchema);
export const customerRoutes = make(customer, customerSchema);
