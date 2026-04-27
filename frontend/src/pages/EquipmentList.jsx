import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const navigate = useNavigate();

  // ================= LOAD EQUIPMENT =================
  const loadEquipment = async () => {
    try {
      const res = await API.get("/equipment");
      setEquipment(res.data);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  // ================= FILTER + SORT =================
  const filteredEquipment = equipment
    .filter((eq) =>
      eq.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((eq) =>
      category ? eq.category === category : true
    )
    .sort((a, b) => {
      if (sort === "low") return a.pricePerDay - b.pricePerDay;
      if (sort === "high") return b.pricePerDay - a.pricePerDay;
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="equipment-page">
      <h2>Available Equipment</h2>

      {/* ================= CONTROLS ================= */}
      <div className="equipment-controls">
        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tractor">Tractor</option>
          <option value="Harvester">Harvester</option>
          <option value="Plough">Plough</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* ================= EQUIPMENT GRID ================= */}
      <div className="equipment-grid">
        {filteredEquipment.length === 0 && (
          <p>No equipment found.</p>
        )}

        {filteredEquipment.map((eq) => (
          <div className="equipment-card" key={eq._id}>
            
            {/* IMAGE */}
            <img
  src={
    eq.image
      ? `http://localhost:5000${eq.image}`  // 👈 FIXED BASE URL
      : "https://via.placeholder.com/200"
  }
  alt="equipment"
/>

            {/* INFO */}
            <div className="equipment-info">
              <h3>{eq.name}</h3>
              <p>🚜 {eq.category}</p>
              <p>📍 {eq.location}</p>
              <p className="price">₹{eq.pricePerDay} / day</p>

              {/* ⭐ RATING (FIXED) */}
              <p>
                ⭐{" "}
                {eq.rating && eq.rating > 0
                  ? eq.rating
                  : "No ratings yet"}
              </p>

              {/* BUTTON */}
              <button
                className="rent-btn"
                onClick={() => navigate(`/equipment/${eq._id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipmentList;