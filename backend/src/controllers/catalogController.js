import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";
import Customer from "../models/Customer.js";
import { success, failure } from "../utils/api.js";
const pluralize = (label) =>
  label.endsWith("y")
    ? `${label.slice(0, -1).toLowerCase()}ies`
    : `${label.toLowerCase()}s`;
const crud = (Model, label) => ({
  list: async (req, res) =>
    success(res, 200, `${label}s fetched`, {
      [pluralize(label)]: await Model.find().sort("name"),
    }),
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      success(res, 201, `${label} created`, { [label.toLowerCase()]: item });
    } catch (e) {
      if (e.code === 11000) return failure(res, 409, `${label} already exists`);
      throw e;
    }
  },
  update: async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return failure(res, 404, `${label} not found`);
    success(res, 200, `${label} updated`, { [label.toLowerCase()]: item });
  },
  remove: async (req, res) => {
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!item) return failure(res, 404, `${label} not found`);
    success(res, 200, `${label} deactivated`, { [label.toLowerCase()]: item });
  },
});
export const category = crud(Category, "Category");
export const supplier = crud(Supplier, "Supplier");
export const customer = crud(Customer, "Customer");
export const ensureWalkIn = async () => {
  if (!(await Customer.exists({ name: "Walk-in Customer" })))
    await Customer.create({ name: "Walk-in Customer", isActive: true });
};
