import Notification from "../models/Notification.js";
import User from "../models/User.js";
export const notifyStaff = async ({ title, message, type }) => {
  const users = await User.find({ isActive: true }, { _id: 1 });
  if (users.length)
    await Notification.insertMany(
      users.map((u) => ({ user: u._id, title, message, type })),
    );
};
export const notifyUser = async ({ user, title, message, type }) =>
  Notification.create({ user, title, message, type });
