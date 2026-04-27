import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
