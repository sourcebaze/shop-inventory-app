import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/database.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Settings from "../models/Settings.js";
const run = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Supplier.deleteMany({}),
    Customer.deleteMany({}),
    Product.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  const password = process.env.SEED_PASSWORD || "StockWise123!";
  const users = await User.create([
    {
      fullName: "Demo Owner",
      email: process.env.SEED_OWNER_EMAIL || "owner@stockwise.local",
      password: await bcrypt.hash(password, 12),
      role: "owner",
    },
    {
      fullName: "Demo Manager",
      email: process.env.SEED_MANAGER_EMAIL || "manager@stockwise.local",
      password: await bcrypt.hash(password, 12),
      role: "manager",
    },
    {
      fullName: "Demo Staff",
      email: process.env.SEED_STAFF_EMAIL || "staff@stockwise.local",
      password: await bcrypt.hash(password, 12),
      role: "staff",
    },
  ]);
  const cats = await Category.create(
    ["Groceries", "Household", "Beverages", "Bakery"].map((name) => ({
      name,
      description: `${name} products`,
    })),
  );
  const suppliers = await Supplier.create([
    {
      name: "Mainline Distributors",
      phone: "08030000001",
      address: "Lagos, Nigeria",
    },
    {
      name: "Prime Wholesale",
      phone: "08030000002",
      address: "Onitsha, Nigeria",
    },
  ]);
  await Customer.create({ name: "Walk-in Customer" });
  await Customer.create({
    name: "Chinedu Okafor",
    phone: "08040000001",
    email: "chinedu@example.com",
  });
  const cat = (name) => {
    const category = cats.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
    if (!category) throw new Error(`Seed category not found: ${name}`);
    return category._id;
  };
  const products = [
    [
      "Premium Rice 5kg",
      "SW-RICE-005",
      cat("Groceries"),
      suppliers[0]._id,
      6500,
      7800,
      18,
      5,
    ],
    [
      "Granulated Sugar 1kg",
      "SW-SUG-001",
      cat("Groceries"),
      suppliers[0]._id,
      1200,
      1500,
      7,
      5,
    ],
    [
      "Peak Milk 400g",
      "SW-MIL-400",
      cat("Beverages"),
      suppliers[1]._id,
      1800,
      2200,
      24,
      8,
    ],
    [
      "Milo 500g",
      "SW-MIL-500",
      cat("Beverages"),
      suppliers[1]._id,
      3500,
      4200,
      3,
      5,
    ],
    [
      "Bathing Soap",
      "SW-SOAP-001",
      cat("Household"),
      suppliers[0]._id,
      700,
      950,
      40,
      10,
    ],
    [
      "Sliced Bread",
      "SW-BRD-001",
      cat("Bakery"),
      suppliers[1]._id,
      900,
      1200,
      0,
      5,
    ],
    [
      "Vegetable Oil 2L",
      "SW-OIL-002",
      cat("Groceries"),
      suppliers[0]._id,
      4200,
      5000,
      12,
      5,
    ],
    [
      "Detergent 1kg",
      "SW-DET-001",
      cat("Household"),
      suppliers[0]._id,
      1700,
      2100,
      6,
      5,
    ],
  ].map(
    ([
      name,
      SKU,
      category,
      supplier,
      buyingPrice,
      sellingPrice,
      quantity,
      minimumStock,
    ]) => ({
      name,
      SKU,
      category,
      supplier,
      buyingPrice,
      sellingPrice,
      quantity,
      minimumStock,
    }),
  );
  await Product.create(products);
  await Settings.create({
    shopName: "StockWise Demo Shop",
    shopAddress: "Major Road, Umunnachi",
    shopPhone: "08000000000",
    currency: "NGN",
    defaultMinimumStock: 5,
  });
  console.log(`Seed complete. Demo password: ${password}`);
  await mongoose.disconnect();
};
run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
