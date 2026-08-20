import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (uri.includes("<db_password>") || uri.includes("<username>")) {
    throw new Error(
      "MONGODB_URI still contains placeholder credentials. Replace <db_password> and <username> in backend/.env.",
    );
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
