import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({ email });
        if(!user){
            return res.status(200).json({ success: false, message: "User not found" }); 
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(200).json({ success: false, message: "Invalid credentials" });
        }
        const token = createToken(user._id);
        res.status(200).json({ success: true, message: "User logged in successfully",token });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Error in login" });
    }
};
const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
}
//register user
const registerUser = async (req, res) => {
  const {name,password,email } = req.body;
  try {
    //checking if user already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(200)
        .json({ success: false, message: "User already exist" });
    }
    //validating user data
    if (!validator.isEmail(email)) {
      return res.status(200).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res
        .status(200)
        .json({
          success: false,
          message: "Password must be atleast 8 characters long",
        });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //creating new user2
    const newUser = new userModel({
      name:name,
      email:email,
      password:hashedPassword,
    })

    const user = await newUser.save();

    const  token = createToken(user._id);

    res.status(200).json({ success: true, message: "User registered successfully",token });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error in registration" });
  }
};

export { loginUser, registerUser };
