import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function MyEquipment() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchMyEquipment = async () => {
    try {
      const res = await API.get("/equipment");

      const myEquipment = res.data.filter(
        (item) =>
          item.owner?._id === user?._id ||
          item.owner === user?._id
      );

      setEquipment(myEquipment);
    } catch (err) {
      console.error("Failed to load equipment:", err);
      alert("Failed to load your equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEquipment();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this equipment?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/equipment/${id}`);

      setEquipment((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Equipment deleted successfully!");
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete equipment"
      );
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Loading...
      </p>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="my-equipment-container">

        <h2 className="my-equipment-title">
          🚜 My Equipment
        </h2>

        {equipment.length === 0 ? (
          <div className="empty-equipment">
            <p>You have not listed any equipment yet.</p>

            <button
              className="primary-btn"
              onClick={() => navigate("/list-equipment")}
            >
              + List Equipment
            </button>
          </div>
        ) : (
          <div className="equipment-grid">
            {equipment.map((item) => (
              <div
                className="equipment-card"
                key={item._id}
              >
                {item.image && (
                  <img
                    src={`https://agroshare-0j9k.onrender.com${item.image}`}
                    alt={item.name}
                    className="equipment-image"
                  />
                )}

                <div className="equipment-info">
                  <h3>{item.name}</h3>

                  <p>
                    <strong>Category:</strong>{" "}
                    {item.category}
                  </p>

                  <p>
                    📍 {item.location}
                  </p>

                  <p>
                    💰 ₹{item.pricePerDay} / day
                  </p>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyEquipment;