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

// ✅ FINAL CORS FIX (WORKS FOR LOCAL + DEPLOYED)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://food-del-frontend-6zb3.onrender.com", // ✅ YOUR CURRENT FRONTEND (IMPORTANT)
  "https://food-del-frontend-3jtq.onrender.com", // (old one - optional)
  "https://food-del-admin.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ Allow Postman / mobile apps / no-origin requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ DATABASE CONNECTION
connectDB();

// ✅ ROUTES
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ TEST API
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ ERROR HANDLING (IMPORTANT FOR DEBUGGING)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ✅ SERVER START
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});