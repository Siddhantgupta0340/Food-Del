import foodModel from "../models/foodModel.js";

// ✅ ADD FOOD
const addFood = async (req, res) => {
  try {
    // ✅ CLOUDINARY URL
    const image_url = req.file.path;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_url, // ✅ SAVE FULL URL
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
    console.log(error);
    res.json({ success: false, message: "Error fetching food" });
  }
};

// ✅ REMOVE FOOD
const removeFood = async (req, res) => {
  try {
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

    // ✅ NEW IMAGE (if uploaded)
    if (req.file) {
      updateData.image = req.file.path;
    }

    await foodModel.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating" });
  }
};

export { addFood, listFood, removeFood, updateFood, singleFood };
