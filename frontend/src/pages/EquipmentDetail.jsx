import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function EquipmentDetail() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    transportResponsibility: ""
  });

  const [totalCost, setTotalCost] = useState(0);

  // ================= LOAD EQUIPMENT =================
  useEffect(() => {
    if (!id) return;

    API.get(`/equipment/${id}`)
      .then(res => setEquipment(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load equipment");
      });
  }, [id]);

  // ================= CALCULATE COST =================
  useEffect(() => {
    if (form.startDate && form.endDate && equipment) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      const days =
        (end - start) / (1000 * 60 * 60 * 24) + 1;

      if (days > 0) {
        setTotalCost(days * equipment.pricePerDay);
      }
    }
  }, [form, equipment]);

  // ================= RENT REQUEST =================
  const handleRequestRent = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (
      !form.startDate ||
      !form.endDate ||
      !form.transportResponsibility
    ) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      await API.post("/rentals", {
        equipment: id,
        farmer: user._id,
        startDate: form.startDate,
        endDate: form.endDate,
        transportResponsibility: form.transportResponsibility,
      });

      alert("✅ Rental request sent!");

    } catch (err) {
      console.error(err);
      alert("Error sending request ❌");
    }
  };

  // ================= STAR RENDER =================
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const empty = 5 - full;

    return (
      <>
        {"★".repeat(full)}
        {"☆".repeat(empty)}
      </>
    );
  };

  // ================= STYLES =================
  const inputStyle = {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none"
  };

  if (!equipment) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        maxWidth: "1000px",
        margin: "40px auto",
        alignItems: "flex-start",
      }}
    >
      {/* IMAGE */}
    <img
  src={
    equipment.image
      ? `https://agroshare-0j9k.onrender.com${equipment.image}`
      : "https://via.placeholder.com/300"
  }
  alt="equipment"
  style={{
    width: "350px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  }}
/>

      {/* DETAILS */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2>{equipment.name}</h2>

        <p style={{ fontSize: "20px", color: "green", fontWeight: "600" }}>
          ₹{equipment.pricePerDay} / day
        </p>

        <p>📍 {equipment.location}</p>

        {/* ⭐ RATING */}
        <p style={{ margin: "15px 0" }}>
          {equipment.rating > 0 ? (
            <span style={{ color: "gold", fontSize: "18px" }}>
              {renderStars(equipment.rating)} ({equipment.rating})
            </span>
          ) : (
            "⭐ No ratings yet"
          )}
        </p>

        {/* DATE INPUT */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        {/* TOTAL */}
        {totalCost > 0 && (
          <p style={{ fontWeight: "500", marginBottom: "10px" }}>
            💰 Total Cost: ₹{totalCost}
          </p>
        )}

        {/* TRANSPORT */}
        <div style={{ marginBottom: "20px" }}>
          <h4>🚛 Transport Arrangement</h4>

          <label style={{ display: "block", marginTop: "8px" }}>
            <input
              type="radio"
              value="farmer"
              checked={form.transportResponsibility === "farmer"}
              onChange={(e) =>
                setForm({
                  ...form,
                  transportResponsibility: e.target.value,
                })
              }
            />
            {" "}I will arrange transport
          </label>

          <label style={{ display: "block", marginTop: "5px" }}>
            <input
              type="radio"
              value="owner"
              checked={form.transportResponsibility === "owner"}
              onChange={(e) =>
                setForm({
                  ...form,
                  transportResponsibility: e.target.value,
                })
              }
            />
            {" "}Owner will arrange transport
          </label>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleRequestRent}
          style={{
            width: "100%",
            padding: "12px",
            background: "#1e8e3e",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Request Rent
        </button>
      </div>
    </div>
  );
}

export default EquipmentDetail;