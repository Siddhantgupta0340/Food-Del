import foodModel from "../models/foodModel.js";
import fs from "fs";

// ✅ ADD FOOD
const addFood = async (req, res) => {
  try {
    // 🔥 REMOVE SPACE FROM IMAGE NAME
    let image_filename = req.file.filename.replace(/ /g, "_");

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// ✅ LIST FOOD
const listFood = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.json({ success: true, data: food });
  } catch (error) {
    res.json({ success: false, message: "Error fetching" });
  }
};

// ✅ REMOVE FOOD
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (food?.image) {
      fs.unlink(`uploads/${food.image}`, () => {});
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting" });
  }
};

// ✅ SINGLE FOOD
const singleFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    res.json({ success: false, message: "Error fetching item" });
  }
};

// ✅ UPDATE FOOD
const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category } = req.body;

    let updateData = { name, description, price, category };

    if (req.file) {
      let newImage = req.file.filename.replace(/ /g, "_");
      updateData.image = newImage;

      const oldFood = await foodModel.findById(id);
      if (oldFood?.image) {
        fs.unlink(`uploads/${oldFood.image}`, () => {});
      }
    }

    await foodModel.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating" });
  }
};

export { addFood, listFood, removeFood, updateFood, singleFood };
