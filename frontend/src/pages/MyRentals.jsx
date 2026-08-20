import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function MyRentals() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();

  const loadRentals = async () => {
    try {
      const url =
        user.role === "owner"
          ? `/rentals/owner/${user._id}`
          : `/rentals/renter/${user._id}`;

      const res = await API.get(url);
      setRentals(res.data);
    } catch (err) {
      console.error("Failed to load rentals:", err);
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  /* ================= ACTIONS ================= */

  const approveRental = async (id) => {
    try {
      await API.put(`/rentals/${id}/approve`);
      loadRentals();
    } catch (err) {
      console.error("Approve rental error:", err);
      alert("Failed to approve rental");
    }
  };

  const rejectRental = async (id) => {
    try {
      await API.put(`/rentals/${id}/reject`);
      loadRentals();
    } catch (err) {
      console.error("Reject rental error:", err);
      alert("Failed to reject rental");
    }
  };

  const handleCOD = async (r) => {
    try {
      await API.put(`/rentals/${r._id}/cod`);
      loadRentals();
    } catch (err) {
      console.error("COD error:", err);
      alert("Failed to select Cash on Delivery");
    }
  };

  const handlePayment = async (r) => {
    try {
      const res = await API.post("/payment/create-order", {
        amount: r.totalAmount,
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        order_id: res.data.id,

        handler: async (response) => {
          try {
            await API.put(`/rentals/${r._id}/mark-paid`, {
              paymentId: response.razorpay_payment_id,
            });

            loadRentals();
          } catch (err) {
            console.error(
              "Payment confirmation error:",
              err
            );

            alert("Payment confirmation failed");
          }
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay is not loaded");
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  const submitRating = async (id, rating) => {
    try {
      await API.put(`/rentals/${id}/rate`, {
        rating,
      });

      loadRentals();
    } catch (err) {
      console.error("Rating error:", err);
      alert("Failed to submit rating");
    }
  };

  /* ================= UI ================= */

  return (
    <div style={container}>

      <h2>
        {user.role === "owner"
          ? "Rental Requests"
          : "My Rentals"}
      </h2>

      {rentals.length === 0 && (
        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          No rentals found.
        </p>
      )}

      {rentals.map((r) => (
        <div key={r._id} style={card}>

          {/* ================= EQUIPMENT ================= */}

          <h3 style={title}>
            {r.equipment?.name}
          </h3>

          <p style={location}>
            📍 {r.equipment?.location}
          </p>

          <p style={status}>
            Status: <b>{r.status}</b>
          </p>


          {/* ================= OWNER APPROVAL ================= */}

          {user.role === "owner" &&
            r.status === "pending" && (

              <div
                style={{
                  marginBottom: "10px",
                }}
              >

                <button
                  style={approveBtn}
                  onClick={() =>
                    approveRental(r._id)
                  }
                >
                  Approve
                </button>

                <button
                  style={rejectBtn}
                  onClick={() =>
                    rejectRental(r._id)
                  }
                >
                  Reject
                </button>

              </div>
            )}


          {/* ================= TRANSPORT ================= */}

          {/* No transport request yet */}

          {r.transportStatus === "none" &&
            r.status === "approved" &&
            (
              (user.role === "farmer" &&
                r.transportResponsibility === "farmer") ||
              (user.role === "owner" &&
                r.transportResponsibility === "owner")
            ) && (

              <div
                style={{
                  marginTop: "12px",
                }}
              >

                <button
                  style={transportBtn}
                  onClick={() =>
                    navigate("/transport", {
                      state: {
                        rentalId: r._id,
                        equipmentId:
                          r.equipment?._id,
                      },
                    })
                  }
                >
                  🚛 Choose Transport Helper
                </button>

              </div>
            )}


          {/* Transport request pending */}

          {r.transportStatus === "pending" && (

            <p style={pendingTransport}>
              ⏳ Transport request sent.
              Waiting for helper approval...
            </p>
          )}


          {/* Transport approved */}

          {r.transportStatus === "approved" &&
            r.transport && (

              <p style={transportText}>
                🚛 Transport Helper:{" "}
                <b>
                  {r.transport.name}
                </b>

                {r.transport.vehicleType &&
                  ` (${r.transport.vehicleType})`}
              </p>
            )}


          {/* Transport rejected */}

          {r.transportStatus === "rejected" && (

            <div
              style={{
                marginTop: "10px",
              }}
            >

              <p style={rejectedTransport}>
                ❌ Transport request was rejected.
              </p>

              <button
                style={transportBtn}
                onClick={() =>
                  navigate("/transport", {
                    state: {
                      rentalId: r._id,
                      equipmentId:
                        r.equipment?._id,
                    },
                  })
                }
              >
                🚛 Choose Another Helper
              </button>

            </div>
          )}


          {/* ================= PAYMENT ================= */}

          {user.role === "farmer" &&
            r.status === "approved" &&
            r.transportStatus === "approved" &&
            r.transport && (

              <div style={paymentSection}>

                {r.paymentStatus === "paid" ? (

                  <p style={paidText}>
                    ✅ Payment Successful
                  </p>

                ) : r.paymentMethod === "COD" ? (

                  <p style={codText}>
                    💵 Cash on Delivery
                  </p>

                ) : (

                  <>
                    <button
                      style={payBtn}
                      onClick={() =>
                        handlePayment(r)
                      }
                    >
                      Pay Online
                    </button>

                    <button
                      style={codBtn}
                      onClick={() =>
                        handleCOD(r)
                      }
                    >
                      Cash on Delivery
                    </button>
                  </>
                )}

              </div>
            )}


          {/* ================= RATING ================= */}

          {r.paymentStatus === "paid" &&
            !r.rating && (

              <div style={ratingSection}>

                <p>
                  Rate your experience:
                </p>

                {[1, 2, 3, 4, 5].map((s) => (

                  <span
                    key={s}
                    style={star}
                    onClick={() =>
                      submitRating(r._id, s)
                    }
                  >
                    ★
                  </span>

                ))}

              </div>
            )}


          {/* Existing rating */}

          {r.rating && (

            <p
              style={{
                marginTop: "8px",
              }}
            >
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </p>
          )}

        </div>
      ))}

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const container = {
  padding: "20px",
  maxWidth: "800px",
  margin: "auto",
};

const card = {
  border: "1px solid #e5e7eb",
  padding: "18px",
  marginBottom: "16px",
  borderRadius: "12px",
  background: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const title = {
  marginBottom: "6px",
};

const location = {
  color: "#6b7280",
};

const status = {
  marginBottom: "10px",
};


/* ================= TRANSPORT ================= */

const transportBtn = {
  background: "#2563eb",
  color: "white",
  padding: "9px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const transportText = {
  color: "#0f766e",
  marginBottom: "10px",
  fontWeight: "500",
};

const pendingTransport = {
  color: "#d97706",
  fontWeight: "600",
  background: "#fff7ed",
  padding: "10px",
  borderRadius: "8px",
  marginTop: "10px",
};

const rejectedTransport = {
  color: "#dc2626",
  fontWeight: "600",
};


/* ================= PAYMENT ================= */

const paymentSection = {
  marginTop: "12px",
};

const payBtn = {
  background: "#16a34a",
  color: "white",
  marginRight: "10px",
  padding: "8px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const codBtn = {
  background: "#f59e0b",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const paidText = {
  color: "#16a34a",
  fontWeight: "600",
  marginTop: "8px",
};

const codText = {
  color: "#f59e0b",
  fontWeight: "600",
  marginTop: "8px",
};


/* ================= OWNER APPROVAL ================= */

const approveBtn = {
  background: "#16a34a",
  color: "white",
  marginRight: "10px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#dc2626",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};


/* ================= RATING ================= */

const ratingSection = {
  marginTop: "12px",
};

const star = {
  fontSize: "22px",
  color: "gold",
  cursor: "pointer",
  marginRight: "4px",
};


export default MyRentals;