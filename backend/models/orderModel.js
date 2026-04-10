import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },

  // ✅ ORDER STATUS (ADMIN CONTROL)
  status: { type: String, default: "Pending" },

  // ✅ PAYMENT STATUS (SYSTEM CONTROL)
  paymentStatus: { type: String, default: "Pending" },

  Date: { type: Date, default: Date.now },

  paymentId: { type: String },
});

const orderModel =
  mongoose.models.order || mongoose.model("Order", orderSchema);

export default orderModel;
