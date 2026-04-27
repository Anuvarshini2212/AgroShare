import { useEffect, useState } from "react";
import API from "../api";

function HelperRequests() {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const loadRequests = async () => {
    try {
      const res = await API.get(`/transport/my-requests/${user._id}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  
  const updateStatus = async (requestId, status) => {
    try {
      await API.put(`/transport/update-status/${requestId}`, { status });

     
      loadRequests();

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error updating status ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚛 My Transport Requests</h2>

      {requests.length === 0 ? (
        <p>No transport requests yet</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              margin: "15px 0",
              padding: "15px",
              backgroundColor: "#f9f9f9",
            }}
          >
           
            <p><strong>👨‍🌾 Farmer:</strong> {req.farmer?.name}</p>

          
            {req.status === "approved" && req.farmer?.phone && (
              <>
                <p><strong>📞 Phone:</strong> {req.farmer.phone}</p>

                <a
                  href={`https://wa.me/91${req.farmer.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    padding: "8px 12px",
                    backgroundColor: "#25D366",
                    color: "white",
                    borderRadius: "5px",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  💬 Chat on WhatsApp
                </a>
              </>
            )}

           
            <p><strong>🚜 Equipment:</strong> {req.equipment?.name}</p>

        
            <p><strong>🏠 Owner:</strong> {req.owner?.name}</p>

      
            <p>
              <strong>📍 Pickup:</strong>{" "}
              {req.equipment?.location || "N/A"}
            </p>

          
            <p>
              <strong>📍 Delivery:</strong>{" "}
              {req.deliveryLocation || "📞 Contact farmer"}
            </p>

         
            <p>
              <strong>📅 Date:</strong>{" "}
              {req.transportDate
                ? new Date(req.transportDate).toLocaleDateString()
                : "N/A"}
            </p>

         
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    req.status === "approved"
                      ? "green"
                      : req.status === "rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {req.status}
              </span>
            </p>

            {/* ACTION BUTTONS */}
            {req.status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus(req._id, "approved")}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => updateStatus(req._id, "rejected")}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ❌ Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default HelperRequests;