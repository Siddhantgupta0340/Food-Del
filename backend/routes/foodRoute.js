import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
  singleFood,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// multer config
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

// ✅ NEW ROUTES
foodRouter.get("/:id", singleFood);
foodRouter.post("/update", upload.single("image"), updateFood);

export default foodRouter;
