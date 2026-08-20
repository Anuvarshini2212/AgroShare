import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">🌾 AgroShare</div>

      <div className="nav-links">
        <Link to="/">Home</Link>

       {user?.role === "farmer" && (
  <>
    <Link to="/equipment">Equipment</Link>
    <Link to="/my-rentals">My Rentals</Link>
  </>
)}

       {user.role === "owner" && (
  <>
    <Link to="/list-equipment">List Equipment</Link>
    <Link to="/my-equipment">My Equipment</Link>
    <Link to="/my-rentals">Rental Requests</Link>
  </>
)}

        {user.role === "transport" && (
  <>
    <Link to="/transport-register">Register</Link>
    <Link to="/transport-requests">Requests</Link>
  </>
)}


        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
