import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// ================= TOKEN =================
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be 8+ chars" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed" });
  }
};

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// ================= UPDATE PROFILE (🔥 FIXED) =================
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // ✅ VALIDATION
    if (!name) {
      return res.json({ success: false, message: "Name is required" });
    }

    // ✅ UPDATE + RETURN UPDATED DATA
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        {
          name,
          phone,
        },
        { new: true }, // 🔥 VERY IMPORTANT
      )
      .select("-password");

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile Updated Successfully ✅",
      data: updatedUser, // 🔥 RETURN UPDATED USER
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Update failed ❌" });
  }
};

export { registerUser, loginUser, getProfile, updateProfile };
