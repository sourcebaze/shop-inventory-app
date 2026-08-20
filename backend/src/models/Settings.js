import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    shopName: { type: String, default: "StockWise Shop" },
    shopAddress: { type: String, default: "" },
    shopPhone: { type: String, default: "" },
    currency: { type: String, default: "NGN" },
    defaultMinimumStock: { type: Number, default: 5, min: 0 },
  },
  { timestamps: true },
);
export default mongoose.model("Settings", schema);
