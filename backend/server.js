import express from "express";
import cors from "cors";
import "dotenv/config.js";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ FINAL CORS FIX (NO ERROR NOW)
app.use(
  cors({
    origin: "*", // 🔥 allow all (best for now)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ DB
connectDB();

// ✅ ROUTES
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ✅ START SERVER
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
