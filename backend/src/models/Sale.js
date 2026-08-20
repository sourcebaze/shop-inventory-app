import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: String,
    quantity: { type: Number, min: 1, required: true },
    unitPrice: { type: Number, min: 0, required: true },
    subtotal: { type: Number, min: 0, required: true },
  },
  { _id: false },
);
const schema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, min: 0, required: true },
    discount: { type: Number, min: 0, default: 0 },
    total: { type: Number, min: 0, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Transfer", "POS", "Card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "voided"],
      default: "completed",
    },
  },
  { timestamps: true },
);
export default mongoose.model("Sale", schema);
