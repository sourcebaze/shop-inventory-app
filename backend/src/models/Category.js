import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
schema.index({ name: 1 }, { unique: true });
export default mongoose.model("Category", schema);
