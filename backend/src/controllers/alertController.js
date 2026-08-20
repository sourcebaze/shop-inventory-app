import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import { success } from "../utils/api.js";
export const alerts = async (req, res) => {
  const products = await Product.find({
    isDeleted: false,
    $expr: { $lte: ["$quantity", "$minimumStock"] },
  })
    .populate("category", "name")
    .sort({ quantity: 1 });
  const notifications = await Notification.find({ user: req.user._id })
    .sort("-createdAt")
    .limit(50);
  success(res, 200, "Alerts fetched", {
    products,
    notifications,
    counts: {
      lowStock: products.filter((p) => p.quantity > 0).length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
      unread: notifications.filter((n) => !n.isRead).length,
    },
  });
};
export const markRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, _id: { $in: req.body.ids || [] } },
    { $set: { isRead: true } },
  );
  success(res, 200, "Notifications marked as read");
};
