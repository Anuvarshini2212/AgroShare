import { useEffect, useState } from "react";
import API from "../api";

function OwnerTransportRequests() {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  API.get(`/transport/farmer-requests/${user._id}`)
    .then(res => setRequests(res.data));
}, []);

  return (
    <div className="container">
      <h2>Transport Requests</h2>

      {requests.map(r => (
        <div className="card" key={r._id}>
          <p>Farmer: {r.farmer.name}</p>
          <p>Equipment: {r.equipment.name}</p>
          <p>Helper: {r.helper.name}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}

export default OwnerTransportRequests;