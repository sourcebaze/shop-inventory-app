import Product from "../models/Product.js";
import StockHistory from "../models/StockHistory.js";
import { notifyStaff } from "./notificationService.js";
export const changeStock = async ({
  productId,
  delta,
  action,
  userId,
  note = "",
  session = null,
}) => {
  const product = await Product.findById(productId).session(session);
  if (!product || product.isDeleted) {
    const e = new Error("Product not found");
    e.statusCode = 404;
    throw e;
  }
  const previous = product.quantity,
    next = previous + delta;
  if (next < 0) {
    const e = new Error(
      `Insufficient stock for ${product.name}. Available: ${previous}`,
    );
    e.statusCode = 400;
    throw e;
  }
  product.quantity = next;
  await product.save({ session });
  await StockHistory.create(
    [
      {
        product: product._id,
        user: userId,
        action,
        quantity: Math.abs(delta),
        previousQuantity: previous,
        newQuantity: next,
        note,
      },
    ],
    { session },
  );
  if (next === 0)
    await notifyStaff({
      title: "Out of stock",
      message: `${product.name} is now out of stock.`,
      type: "out_of_stock",
    });
  else if (next <= product.minimumStock)
    await notifyStaff({
      title: "Low stock",
      message: `${product.name} has ${next} units remaining.`,
      type: "low_stock",
    });
  return product;
};
