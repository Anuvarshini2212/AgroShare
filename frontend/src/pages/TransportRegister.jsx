import { useState } from "react";
import API from "../api";

function TransportRegister() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    phone: "",
    vehicleType: "",
    vehicleNumber: "",
    pricePerKm: "",
    location: "",
    availableFrom: "",
    availableTill: "",
    profilePic: null,
  });

  const handleChange = (e) => {
  if (e.target.name === "profilePic") {
    setForm({ ...form, profilePic: e.target.files[0] });
  } else {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("phone", form.phone);
  formData.append("vehicleType", form.vehicleType);
  formData.append("vehicleNumber", form.vehicleNumber);
  formData.append("pricePerKm", form.pricePerKm);
  formData.append("location", form.location);
  formData.append("availableFrom", form.availableFrom);
  formData.append("availableTill", form.availableTill);

  if (form.profilePic) {
    formData.append("profilePic", form.profilePic);
  }

  try {
    await API.put(
      `/transport/register/${user._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};
  return (
    <div className="page-wrapper">
      <div className="form-card">
        <h2>🚚 Transport Partner Profile</h2>
        <p className="form-subtitle">
          Update your transport service details
        </p>
<div className="form-group">
  <label>Profile Picture</label>
  <input
    type="file"
    name="profilePic"
    accept="image/*"
    onChange={handleChange}
  />
</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <input
              type="text"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Price per Km (₹)</label>
            <input
              type="number"
              name="pricePerKm"
              value={form.pricePerKm}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Service Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Available From</label>
            <input
              type="date"
              name="availableFrom"
              value={form.availableFrom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Available Till</label>
            <input
              type="date"
              name="availableTill"
              value={form.availableTill}
              onChange={handleChange}
            />
          </div>

          <button className="primary-btn" type="submit">
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransportRegister;