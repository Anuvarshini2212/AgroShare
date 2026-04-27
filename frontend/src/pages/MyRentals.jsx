import { useEffect, useState } from "react";
import API from "../api";

function MyRentals() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rentals, setRentals] = useState([]);
  const [helpers, setHelpers] = useState([]);

  const loadRentals = async () => {
    try {
      const url =
        user.role === "owner"
          ? `/rentals/owner/${user._id}`
          : `/rentals/renter/${user._id}`;

      const res = await API.get(url);
      setRentals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHelpers = async () => {
    try {
      const res = await API.get("/transport");
      setHelpers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRentals();
    loadHelpers();
  }, []);

  /* ================= ACTIONS ================= */

  const approveRental = async (id) => {
    await API.put(`/rentals/${id}/approve`);
    loadRentals();
  };

  const rejectRental = async (id) => {
    await API.put(`/rentals/${id}/reject`);
    loadRentals();
  };

  const handleCOD = async (r) => {
    await API.put(`/rentals/${r._id}/cod`);
    loadRentals();
  };

  const handlePayment = async (r) => {
    const res = await API.post("/payment/create-order", {
      amount: r.totalAmount,
    });

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: res.data.amount,
      order_id: res.data.id,
      handler: async (response) => {
        await API.put(`/rentals/${r._id}/mark-paid`, {
          paymentId: response.razorpay_payment_id,
        });
        loadRentals();
      },
    };

    new window.Razorpay(options).open();
  };

  const assignTransport = async (rentalId, helperId) => {
    await API.put(`/rentals/${rentalId}/assign-transport`, {
      transportId: helperId,
    });
    loadRentals();
  };

  const submitRating = async (id, rating) => {
    await API.put(`/rentals/${id}/rate`, { rating });
    loadRentals();
  };

  /* ================= UI ================= */

  return (
    <div style={container}>
      <h2>{user.role === "owner" ? "Rental Requests" : "My Rentals"}</h2>

      {rentals.map((r) => (
        <div key={r._id} style={card}>
          
          <h3 style={title}>{r.equipment?.name}</h3>

          <p style={location}>📍 {r.equipment?.location}</p>

          <p style={status}>
            Status: <b>{r.status}</b>
          </p>

          {/* OWNER APPROVAL */}
          {user.role === "owner" && r.status === "pending" && (
            <div style={{ marginBottom: "10px" }}>
              <button style={approveBtn} onClick={() => approveRental(r._id)}>
                Approve
              </button>
              <button style={rejectBtn} onClick={() => rejectRental(r._id)}>
                Reject
              </button>
            </div>
          )}

          {/* TRANSPORT */}
          {r.transport && (
            <p style={transportText}>
              🚛 {r.transport.name} ({r.transport.vehicleType})
            </p>
          )}

          {/* TRANSPORT SELECTION */}
          {r.status === "approved" &&
            !r.transport &&
            (
              (user.role === "farmer" && r.transportResponsibility === "farmer") ||
              (user.role === "owner" && r.transportResponsibility === "owner")
            ) && (
              <div style={{ marginBottom: "10px" }}>
                <p><b>Choose Transport:</b></p>

                {helpers.map((h) => (
                  <button
                    key={h._id}
                    style={helperBtn}
                    onClick={() => assignTransport(r._id, h._id)}
                  >
                    🚛 {h.name} ({h.vehicleType}) - ₹{h.pricePerKm}/km
                  </button>
                ))}
              </div>
          )}

          {/* PAYMENT */}
          {user.role === "farmer" &&
            r.status === "approved" &&
            r.transport && (

              r.paymentStatus === "paid" ? (
                <p style={paidText}>✅ Payment Successful</p>
              ) : r.paymentMethod === "COD" ? (
                <p style={codText}>💵 Cash on Delivery</p>
              ) : (
                <div style={{ marginTop: "10px" }}>
                  <button style={payBtn} onClick={() => handlePayment(r)}>
                    Pay Online
                  </button>

                  <button style={codBtn} onClick={() => handleCOD(r)}>
                    Cash on Delivery
                  </button>
                </div>
              )
          )}

          {/* RATING */}
          {r.paymentStatus === "paid" && !r.rating && (
            <div style={{ marginTop: "10px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={star}
                  onClick={() => submitRating(r._id, s)}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {r.rating && (
            <p style={{ marginTop: "8px" }}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </p>
          )}

        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "20px",
  maxWidth: "800px",
  margin: "auto"
};

const card = {
  border: "1px solid #e5e7eb",
  padding: "18px",
  marginBottom: "16px",
  borderRadius: "12px",
  background: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const title = {
  marginBottom: "6px"
};

const location = {
  color: "#6b7280"
};

const status = {
  marginBottom: "10px"
};

const transportText = {
  color: "#0f766e",
  marginBottom: "10px",
  fontWeight: "500"
};

const helperBtn = {
  display: "block",
  margin: "5px 0",
  padding: "6px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer"
};

const payBtn = {
  background: "#16a34a",
  color: "white",
  marginRight: "10px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const codBtn = {
  background: "#f59e0b",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const approveBtn = {
  background: "#16a34a",
  color: "white",
  marginRight: "10px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const rejectBtn = {
  background: "#dc2626",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const paidText = {
  color: "#16a34a",
  fontWeight: "600",
  marginTop: "8px"
};

const codText = {
  color: "#f59e0b",
  fontWeight: "600",
  marginTop: "8px"
};

const star = {
  fontSize: "20px",
  color: "gold",
  cursor: "pointer"
};

export default MyRentals;