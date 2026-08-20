import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/database.js";
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`StockWise API listening on http://localhost:${PORT}`),
    );
  } catch (e) {
    console.error("Failed to start server:", e.message);
    process.exit(1);
  }
};
start();
