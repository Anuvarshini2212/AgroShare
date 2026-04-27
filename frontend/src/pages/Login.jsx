import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">

      {/* LEFT PANEL */}
     <div className="login-left">
  <div className="logo">🌾 AgroShare</div>

  <h1>
    Empowering Farmers, Connecting Communities
  </h1>


  <p style={{ fontSize: "16px", opacity: 0.7 }}>
    Together, we build a smarter agricultural community.
  </p>
</div>
      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">

          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Login to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button className="login-btn">Login</button>
          </form>

          <p className="bottom-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>

        </div>
      </div>

    </div>
  );
}