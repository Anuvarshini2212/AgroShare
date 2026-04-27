import { useNavigate } from "react-router-dom";

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
  },

  sidebar: {
    width: "230px",
    background: "#111827",
    color: "white",
    padding: "20px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "25px",
  },

  nav: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
  },

  active: {
    background: "#1f2937",
  },

  main: {
    flex: 1,
    padding: "30px",
  },
};

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const path = window.location.pathname;

  return (
    <div style={styles.layout}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>🌾 Agro Admin</div>

        <div
          style={{
            ...styles.nav,
            ...(path.includes("dashboard") ? styles.active : {}),
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </div>

        <div
          style={{
            ...styles.nav,
            ...(path.includes("equipment") ? styles.active : {}),
          }}
          onClick={() => navigate("/admin/equipment")}
        >
          Equipment
        </div>
      </div>

      <div style={styles.main}>{children}</div>
    </div>
  );
}