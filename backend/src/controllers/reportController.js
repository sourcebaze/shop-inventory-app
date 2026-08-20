import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import StockHistory from "../models/StockHistory.js";
import Category from "../models/Category.js";
import { success } from "../utils/api.js";
export const dashboard = async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const month = new Date();
  month.setDate(1);
  month.setHours(0, 0, 0, 0);
  const [products, categories, today, monthly, low, out, stock, history] =
    await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Category.countDocuments({ isActive: true }),
      Sale.aggregate([
        { $match: { createdAt: { $gte: start }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Sale.aggregate([
        { $match: { createdAt: { $gte: month }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.countDocuments({
        isDeleted: false,
        $expr: {
          $and: [
            { $gt: ["$quantity", 0] },
            { $lte: ["$quantity", "$minimumStock"] },
          ],
        },
      }),
      Product.countDocuments({ isDeleted: false, quantity: 0 }),
      Product.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            qty: { $sum: "$quantity" },
            cost: { $sum: { $multiply: ["$quantity", "$buyingPrice"] } },
            selling: { $sum: { $multiply: ["$quantity", "$sellingPrice"] } },
          },
        },
      ]),
      StockHistory.find()
        .populate("product", "name SKU")
        .populate("user", "fullName")
        .sort("-createdAt")
        .limit(8),
    ]);
  const recent = await Sale.find({ status: "completed" })
    .populate("customer", "name")
    .populate("cashier", "fullName")
    .sort("-createdAt")
    .limit(8);
  success(res, 200, "Dashboard fetched", {
    metrics: {
      totalProducts: products,
      totalCategories: categories,
      totalStockQuantity: stock[0]?.qty || 0,
      lowStockCount: low,
      outOfStockCount: out,
      todaysSales: today[0]?.total || 0,
      monthlySales: monthly[0]?.total || 0,
      inventoryCostValue: stock[0]?.cost || 0,
      inventorySellingValue: stock[0]?.selling || 0,
    },
    recentSales: recent,
    recentStockMovements: history,
  });
};
export const salesReport = async (req, res) => {
  const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
  const since = new Date();
  since.setDate(since.getDate() - days);
  const daily = await Sale.aggregate([
    { $match: { status: "completed", createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: "$total" },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const top = await Sale.aggregate([
    { $match: { status: "completed", createdAt: { $gte: since } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.productName" },
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.subtotal" },
      },
    },
    { $sort: { quantity: -1 } },
    { $limit: 10 },
  ]);
  success(res, 200, "Sales report fetched", { daily, topProducts: top });
};
export const inventoryReport = async (req, res) => {
  const inventory = await Product.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.name",
        quantity: { $sum: "$quantity" },
        products: { $sum: 1 },
        value: { $sum: { $multiply: ["$quantity", "$buyingPrice"] } },
      },
    },
    { $sort: { value: -1 } },
  ]);
  success(res, 200, "Inventory report fetched", { inventory });
};
