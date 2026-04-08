import userModel from "../models/userModel.js";

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);

    let cartData = userData.cartData || {};

    if (!(req.body.itemId in cartData)) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);

    let cartData = userData.cartData || {};

    if (req.body.itemId in cartData) {
      cartData[req.body.itemId] -= 1;

      if (cartData[req.body.itemId] <= 0) {
        delete cartData[req.body.itemId];
      }
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId);

    let cartData = userData.cartData || {};

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export { addToCart, removeFromCart, getCart };
