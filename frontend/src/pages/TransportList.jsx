import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

function TransportList() {
  const [helpers, setHelpers] = useState([]);
  const [deliveryData, setDeliveryData] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();
  const navigate = useNavigate();

  const rentalId = location.state?.rentalId;
  const equipmentId = location.state?.equipmentId;

  console.log("LOCATION STATE:", location.state);

  useEffect(() => {
    if (!rentalId || !equipmentId) {
      alert("Missing data ❌");
      navigate("/my-rentals");
      return;
    }

    API.get("/transport")
      .then((res) => setHelpers(res.data))
      .catch((err) => console.error(err));
  }, [rentalId, equipmentId, navigate]);

  const handleDeliveryChange = (helperId, value) => {
    setDeliveryData((prev) => ({
      ...prev,
      [helperId]: value,
    }));
  };

  //request transport
 const requestTransport = async (helperId) => {
  const deliveryLocation = deliveryData[helperId];

  if (!deliveryLocation) {
    alert("Please enter delivery location");
    return;
  }

  try {
    await API.post("/transport/request", {
      helperId,
      farmerId: user._id,
      equipmentId,
      rentalId,
      deliveryLocation,
      transportDate: new Date(),
    });

    alert("✅ Transport request sent to helper");

    navigate("/my-rentals");

  } catch (err) {
    console.error(
      "Transport request error:",
      err.response?.data || err.message
    );

    alert(
      err.response?.data?.message ||
      "Error requesting transport ❌"
    );
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚛 Transport Helpers</h2>

      {helpers.length === 0 ? (
        <p>No helpers available</p>
      ) : (
        helpers.map((h) => (
          <div
            key={h._id}
            style={{
              border: "1px solid #ddd",
              margin: "15px 0",
              padding: "15px",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <p><b>{h.name}</b></p>
            <p>📍 {h.location}</p>
            <p>🚛 {h.vehicleType}</p>
            <p>💰 ₹{h.pricePerKm}/km</p>

        
            <input
              type="text"
              placeholder="Enter delivery location"
              value={deliveryData[h._id] || ""}
              onChange={(e) =>
                handleDeliveryChange(h._id, e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            />

            <button
              onClick={() => requestTransport(h._id)}
              style={{
                backgroundColor: "#2e7d32",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              🚛 Request Transport
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TransportList;