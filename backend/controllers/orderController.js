import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// ✅ INIT RAZORPAY
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔥 PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await newOrder.save();

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// 🔥 VERIFY PAYMENT
const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ❌ PAYMENT FAILED
    if (expectedSignature !== razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: "Failed",
      });

      return res.json({
        success: false,
        message: "Payment Failed ❌",
      });
    }

    // ✅ PAYMENT SUCCESS
    await orderModel.findByIdAndUpdate(orderId, {
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
      status: "Food Processing",
    });

    await userModel.findByIdAndUpdate(req.userId, {
      cartData: {},
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// ✅ USER ORDERS
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false });
  }
};

// ✅ ADMIN ORDERS
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false });
  }
};

// ✅ UPDATE STATUS (ADMIN)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.json({ success: false });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
