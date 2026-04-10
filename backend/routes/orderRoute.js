import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder,userOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

// ✅ BOTH NEED AUTH
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post ("/userorders",authMiddleware,userOrders);

export default orderRouter;
