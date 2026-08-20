import Product from "../models/Product.js";
import { success, failure } from "../utils/api.js";
const queryFilter = (req) => {
  const {
    search = "",
    category,
    supplier,
    includeDeleted = "false",
  } = req.query;
  const f = {};
  if (includeDeleted !== "true") f.isDeleted = false;
  if (search)
    f.$or = [
      { name: { $regex: search, $options: "i" } },
      { SKU: { $regex: search, $options: "i" } },
    ];
  if (category) f.category = category;
  if (supplier) f.supplier = supplier;
  return f;
};
export const listProducts = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1),
    limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const sort = req.query.sort || "-createdAt";
  const filter = queryFilter(req);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .populate("supplier", "name")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);
  success(res, 200, "Products fetched", {
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};
export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("supplier", "name");
  if (!p) return failure(res, 404, "Product not found");
  success(res, 200, "Product fetched", { product: p });
};
export const createProduct = async (req, res) => {
  const p = await Product.create(req.body);
  success(res, 201, "Product created successfully", {
    product: await p.populate("category", "name"),
  });
};
export const updateProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p || p.isDeleted) return failure(res, 404, "Active product not found");
  Object.assign(p, req.body);
  await p.save();
  success(res, 200, "Product updated successfully", {
    product: await p.populate(["category", "supplier"]),
  });
};
export const deleteProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return failure(res, 404, "Product not found");
  p.isDeleted = true;
  await p.save();
  success(res, 200, "Product moved to trash");
};
export const restoreProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return failure(res, 404, "Product not found");
  p.isDeleted = false;
  await p.save();
  success(res, 200, "Product restored", { product: p });
};
