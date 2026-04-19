import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = "https://food-del-backend-9hm2.onrender.com";

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    image: "",
  });

  const [image, setImage] = useState(null);

  const categories = [
    "Salad",
    "Rolls",
    "Desserts",
    "Sandwich",
    "Cake",
    "Pure Veg",
    "Pasta",
    "Noodles",
  ];

  // ✅ FETCH FOOD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/food/${id}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };
    fetchData();
  }, [id]);

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(`${url}/api/food/update`, formData);

      if (res.data.success) {
        alert("✅ Updated Successfully");
        navigate("/list");
      } else {
        alert("❌ Update Failed");
      }
    } catch (error) {
      console.log("Update error:", error);
      alert("Server Error");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <h2>Edit Food Item</h2>

        {/* ✅ FINAL IMAGE PREVIEW */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>

          <label htmlFor="image">
            <img
              src={
                image ? URL.createObjectURL(image) : data.image // ✅ CLOUDINARY URL
              }
              alt="preview"
              style={{ width: "120px", borderRadius: "10px" }}
            />
          </label>

          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* NAME */}
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={onChangeHandler}
          placeholder="Product Name"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={data.description}
          onChange={onChangeHandler}
          rows="5"
          placeholder="Description"
          required
        />

        {/* CATEGORY + PRICE */}
        <div className="add-category-price">
          <select
            name="category"
            value={data.category}
            onChange={onChangeHandler}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            value={data.price}
            onChange={onChangeHandler}
            placeholder="Price"
            required
          />
        </div>

        <button type="submit" className="add-btn">
          Update Food
        </button>
      </form>
    </div>
  );
};

export default Edit;
