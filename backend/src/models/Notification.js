import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["low_stock", "out_of_stock", "sale", "stock_update", "system"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export default mongoose.model("Notification", schema);
