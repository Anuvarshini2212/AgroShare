import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/signup", form);
    console.log("Signup success:", res.data);

    alert("Account created successfully!");
    window.location.href = "/login";


  } catch (err) {
    console.log("Signup error:", err.response?.data);
    alert("Error creating account");
  }
};

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="left-content">
          <div className="brand-header">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">AgroShare</span>
          </div>

          <h1>
            Join AgroShare.
            <br />
            Start Growing Smarter.
          </h1>

          <p className="tagline">
            Create your account and connect with farmers,
            equipment owners, and transport helpers.
          </p>

          <p className="subtext">
            Together, we build a smarter agricultural community.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <h2>Sign Up</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
<input
  type="text"
  name="phone"
  placeholder="Phone Number"
  value={form.phone}
  onChange={(e) =>
    setForm({ ...form, phone: e.target.value })
  }
/>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              required
            >
              <option value="">Select Role</option>
              <option value="farmer">Farmer</option>
              <option value="owner">Equipment Owner</option>
              <option value="transport">Transport Helper</option>
            </select>

            <button type="submit">Create Account</button>
          </form>

          <p className="signup-text">
            Already have an account? <Link
  to="/login"
  onClick={() => console.log("Navigating to login")}
>
  Login
</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
