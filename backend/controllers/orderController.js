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

    // ✅ SAVE ORDER IN DB
    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // ✅ CREATE RAZORPAY ORDER
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
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
    // ✅ CREATE SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ❌ IF NOT MATCH
    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Invalid signature ❌",
      });
    }

    // ✅ UPDATE ORDER
    await orderModel.findByIdAndUpdate(orderId, {
      paymentId: razorpay_payment_id,
      status: "Paid",
    });

    // ✅ CLEAR CART
    await userModel.findByIdAndUpdate(req.userId, {
      cartData: {},
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

export { placeOrder, verifyOrder };