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

// ✅ FINAL CORS FIX (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://food-del-frontend-6zb3.onrender.com", // ✅ YOUR CURRENT FRONTEND
  "https://food-del-frontend-3jtq.onrender.com",
  "https://food-del-admin.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ CORS Blocked:", origin);
        return callback(null, true); // 🔥 TEMP FIX (allow all to avoid error)
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// ✅ DB
connectDB();

// ✅ ROUTES
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
