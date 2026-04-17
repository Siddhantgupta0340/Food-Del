import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/storeContext";
import "./Profile.css";

const Profile = () => {
  const { url, token, setUser } = useContext(StoreContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.post(
        `${url}/api/user/profile`,
        {},
        { headers: { token } },
      );

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🔥 FIXED UPDATE
  const updateProfile = async () => {
    setSaving(true);

    try {
      const res = await axios.post(
        `${url}/api/user/update`,
        {
          name: data.name,
          phone: data.phone,
        },
        { headers: { token } },
      );

      if (res.data.success) {
        // ✅ UPDATE GLOBAL USER
        setUser((prev) => ({
          ...prev,
          name: data.name,
          phone: data.phone,
        }));

        alert("Profile Updated Successfully ✅");
      }
    } catch (error) {
      console.log(error);
      alert("Update Failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-box">
        <h2>My Profile</h2>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" value={data.email} disabled />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
          />
        </div>

        <button onClick={updateProfile} disabled={saving}>
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
