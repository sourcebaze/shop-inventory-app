import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["stock_in", "stock_out", "adjustment", "sale"],
      required: true,
    },
    quantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);
export default mongoose.model("StockHistory", schema);
