import Product from "../models/Product.js";
import StockHistory from "../models/StockHistory.js";
import { success, failure } from "../utils/api.js";
import { changeStock } from "../services/stockService.js";
export const stockIn = async (req, res) => {
  const p = await changeStock({
    productId: req.body.productId,
    delta: req.body.quantity,
    action: "stock_in",
    userId: req.user._id,
    note: req.body.note,
  });
  success(res, 200, "Stock added successfully", { product: p });
};
export const stockOut = async (req, res) => {
  try {
    const p = await changeStock({
      productId: req.body.productId,
      delta: -req.body.quantity,
      action: "stock_out",
      userId: req.user._id,
      note: req.body.note,
    });
    success(res, 200, "Stock removed successfully", { product: p });
  } catch (e) {
    if (e.statusCode) return failure(res, e.statusCode, e.message);
    throw e;
  }
};
export const adjustStock = async (req, res) => {
  const p = await Product.findById(req.body.productId);
  if (!p || p.isDeleted) return failure(res, 404, "Product not found");
  const previous = p.quantity;
  const next = req.body.newQuantity;
  p.quantity = next;
  await p.save();
  await StockHistory.create({
    product: p._id,
    user: req.user._id,
    action: "adjustment",
    quantity: Math.abs(next - previous),
    previousQuantity: previous,
    newQuantity: next,
    note: req.body.note,
  });
  success(res, 200, "Stock adjusted successfully", { product: p });
};
export const history = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1),
    limit = 20;
  const filter = req.query.productId ? { product: req.query.productId } : {};
  const [items, total] = await Promise.all([
    StockHistory.find(filter)
      .populate("product", "name SKU")
      .populate("user", "fullName")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    StockHistory.countDocuments(filter),
  ]);
  success(res, 200, "Stock history fetched", {
    history: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};
