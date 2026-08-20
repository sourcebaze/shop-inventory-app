import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    SKU: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
    buyingPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    minimumStock: { type: Number, min: 0, default: 5 },
    description: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
schema.index({ name: "text", SKU: "text" });
export default mongoose.model("Product", schema);
