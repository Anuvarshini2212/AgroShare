import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function ListEquipment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    pricePerDay: "",
    location: "",
    image: "",
    availableDate: "",
    rating: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("category", form.category);
  formData.append("pricePerDay", form.pricePerDay);
  formData.append("location", form.location);
  formData.append("availableDate", form.availableDate);
  formData.append("rating", form.rating);
  formData.append("ownerId", user._id);

  if (form.image) {
    formData.append("image", form.image);
  }

  console.log("Selected image:", form.image);
  console.log("Image name:", form.image?.name);

  try {
    const res = await API.post("/equipment", formData);

    console.log("Equipment created:", res.data);

    alert("Equipment listed successfully!");
    navigate("/owner-dashboard"); // keep/change this to your actual owner page

  } catch (err) {
    console.error("UPLOAD ERROR:", err.response?.data || err.message);
    alert("Error uploading equipment");
  }
};

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <h2>🚜 List Your Equipment</h2>
        <p className="form-subtitle">
          Add your agricultural equipment for rent.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Equipment Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Tractor, Harvester..."
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              placeholder="Tractor / Seeder / Plough"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Price Per Day (₹) *</label>
            <input
              type="number"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Village / Town"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
  <label>Upload Equipment Image *</label>
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={(e) =>
      setForm({ ...form, image: e.target.files[0] })
    }
  />
</div>


          <div className="form-group">
            <label>Available From (optional)</label>
            <input
              type="date"
              name="availableDate"
              value={form.availableDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Rating (optional)</label>
            <input
              type="number"
              step="0.1"
              name="rating"
              placeholder="4.5"
              value={form.rating}
              onChange={handleChange}
            />
          </div>

          <button className="primary-btn" type="submit">
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default ListEquipment;
