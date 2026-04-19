import React, { useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const [list, setList] = React.useState([]);
  const navigate = useNavigate();

  // ✅ Fetch data
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error fetching data");
    }
  };

  // ✅ Delete food
  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId,
    });

    if (response.data.success) {
      toast.success("Deleted Successfully");
      await fetchList(); // refresh instantly
    } else {
      toast.error("Error deleting");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Price</b>
          <b>Category</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={item.image} />
              <p>{item.name}</p>
              <p>₹{item.price}</p>
              <p>{item.category}</p>

              {/* ✅ ACTION BUTTONS */}
              <div className="action-buttons">
                {/* ✏️ Edit */}
                <button
                  onClick={() => navigate(`/edit/${item._id}`)}
                  className="edit-btn"
                >
                  ✏️
                </button>

                {/* ❌ Delete */}
                <button
                  onClick={() => removeFood(item._id)}
                  className="delete-btn"
                >
                  ❌
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
