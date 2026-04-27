import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminLogin() {  // ✅ IMPORTANT
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        alert("Not admin");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Login</h2>

      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}