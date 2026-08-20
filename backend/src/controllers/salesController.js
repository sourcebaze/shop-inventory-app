import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import StockHistory from "../models/StockHistory.js";
import { success, failure } from "../utils/api.js";
import { createInvoiceNumber } from "../utils/invoice.js";
import { notifyStaff } from "../services/notificationService.js";

const createSaleFallback = async (req) => {
  const { items, customerId = null, discount = 0, paymentMethod } = req.body;
  const ids = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids }, isDeleted: false });
  if (products.length !== ids.length) {
    const e = new Error("One or more products were not found");
    e.statusCode = 400;
    throw e;
  }
  const map = new Map(products.map((p) => [p._id.toString(), p]));
  let subtotal = 0;
  const saleItems = [];
  for (const line of items) {
    const p = map.get(line.productId);
    if (p.quantity < line.quantity) {
      const e = new Error(
        `Insufficient stock for ${p.name}. Available: ${p.quantity}`,
      );
      e.statusCode = 400;
      throw e;
    }
    const sub = p.sellingPrice * line.quantity;
    subtotal += sub;
    saleItems.push({
      product: p._id,
      productName: p.name,
      quantity: line.quantity,
      unitPrice: p.sellingPrice,
      subtotal: sub,
    });
  }
  if (discount > subtotal) {
    const e = new Error("Discount cannot exceed subtotal");
    e.statusCode = 400;
    throw e;
  }
  if (
    customerId &&
    !(await Customer.exists({ _id: customerId, isActive: true }))
  ) {
    const e = new Error("Customer not found");
    e.statusCode = 404;
    throw e;
  }
  for (const line of items) {
    const p = map.get(line.productId);
    const previous = p.quantity;
    p.quantity -= line.quantity;
    await p.save();
    await StockHistory.create({
      product: p._id,
      user: req.user._id,
      action: "sale",
      quantity: line.quantity,
      previousQuantity: previous,
      newQuantity: p.quantity,
      note: "Sale",
    });
  }
  return Sale.create({
    invoiceNumber: createInvoiceNumber(),
    customer: customerId || null,
    cashier: req.user._id,
    items: saleItems,
    subtotal,
    discount,
    total: subtotal - discount,
    paymentMethod,
  });
};

export const createSale = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const {
        items,
        customerId = null,
        discount = 0,
        paymentMethod,
      } = req.body;
      const ids = items.map((i) => i.productId);
      const products = await Product.find({
        _id: { $in: ids },
        isDeleted: false,
      }).session(session);
      if (products.length !== ids.length) {
        const e = new Error("One or more products were not found");
        e.statusCode = 400;
        throw e;
      }
      const map = new Map(products.map((p) => [p._id.toString(), p]));
      let subtotal = 0;
      const saleItems = [];
      for (const line of items) {
        const p = map.get(line.productId);
        if (p.quantity < line.quantity) {
          const e = new Error(
            `Insufficient stock for ${p.name}. Available: ${p.quantity}`,
          );
          e.statusCode = 400;
          throw e;
        }
        const sub = p.sellingPrice * line.quantity;
        subtotal += sub;
        saleItems.push({
          product: p._id,
          productName: p.name,
          quantity: line.quantity,
          unitPrice: p.sellingPrice,
          subtotal: sub,
        });
      }
      if (discount > subtotal) {
        const e = new Error("Discount cannot exceed subtotal");
        e.statusCode = 400;
        throw e;
      }
      if (
        customerId &&
        !(await Customer.exists({ _id: customerId, isActive: true }).session(
          session,
        ))
      ) {
        const e = new Error("Customer not found");
        e.statusCode = 404;
        throw e;
      }
      for (const line of items) {
        const p = map.get(line.productId);
        const prev = p.quantity;
        p.quantity -= line.quantity;
        await p.save({ session });
        await StockHistory.create(
          [
            {
              product: p._id,
              user: req.user._id,
              action: "sale",
              quantity: line.quantity,
              previousQuantity: prev,
              newQuantity: p.quantity,
              note: "Sale",
            },
          ],
          { session },
        );
      }
      const [sale] = await Sale.create(
        [
          {
            invoiceNumber: createInvoiceNumber(),
            customer: customerId || null,
            cashier: req.user._id,
            items: saleItems,
            subtotal,
            discount,
            total: subtotal - discount,
            paymentMethod,
          },
        ],
        { session },
      );
      result = sale;
    });
    await notifyStaff({
      title: "Sale recorded",
      message: `Invoice ${result.invoiceNumber} was completed for ₦${result.total.toLocaleString()}.`,
      type: "sale",
    });
    await session.endSession();
    const sale = await Sale.findById(result._id)
      .populate("customer", "name phone")
      .populate("cashier", "fullName");
    success(res, 201, "Sale completed successfully", { sale });
  } catch (e) {
    await session.endSession();
    if (e.statusCode) return failure(res, e.statusCode, e.message);
    const unsupported = /transaction|replica set|mongos/i.test(e.message || "");
    if (unsupported) {
      try {
        const fallback = await createSaleFallback(req);
        await notifyStaff({
          title: "Sale recorded",
          message: `Invoice ${fallback.invoiceNumber} was completed for ₦${fallback.total.toLocaleString()}.`,
          type: "sale",
        });
        const sale = await Sale.findById(fallback._id)
          .populate("customer", "name phone")
          .populate("cashier", "fullName");
        return success(res, 201, "Sale completed successfully", { sale });
      } catch (f) {
        if (f.statusCode) return failure(res, f.statusCode, f.message);
        throw f;
      }
    }
    throw e;
  }
};
export const listSales = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1),
    limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter = {};
  if (req.query.search)
    filter.invoiceNumber = { $regex: req.query.search, $options: "i" };
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to)
      filter.createdAt.$lte = new Date(`${req.query.to}T23:59:59.999Z`);
  }
  const [sales, total] = await Promise.all([
    Sale.find(filter)
      .populate("customer", "name")
      .populate("cashier", "fullName")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Sale.countDocuments(filter),
  ]);
  success(res, 200, "Sales fetched", {
    sales,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};
export const getSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate("customer", "name phone email address")
    .populate("cashier", "fullName")
    .populate("items.product", "name SKU");
  if (!sale) return failure(res, 404, "Sale not found");
  success(res, 200, "Sale fetched", { sale });
};
