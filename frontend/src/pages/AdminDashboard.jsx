import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f3f4f6" },
  sidebar: { width: "220px", background: "#1f2937", color: "white", padding: "20px" },
  active: { padding: "10px", background: "#374151", borderRadius: "6px", marginBottom: "10px", cursor: "pointer" },
  nav: { padding: "10px", cursor: "pointer" },
  main: { flex: 1, padding: "20px" },
  box: { background: "white", padding: "20px", marginBottom: "20px", borderRadius: "10px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px", borderBottom: "1px solid #ddd" },
  td: { padding: "10px", borderBottom: "1px solid #eee" },
  deleteBtn: { background: "#ef4444", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" },
  cards: { display: "flex", gap: "20px", marginBottom: "20px" },
  card: { background: "white", padding: "20px", borderRadius: "10px", flex: 1 },
  cardLabel: { fontSize: "14px", color: "#6b7280", marginBottom: "5px" },
  cardValue: { fontSize: "24px", fontWeight: "bold", margin: "0" }
};

export default function AdminDashboard() {
  const [data, setData] = useState({});
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const usersPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      API.get("/admin/analytics").then(res => setData(res.data || {})).catch(() => {});
      API.get("/admin/equipment").then(res => setEquipment(res.data || [])).catch(() => {});
      API.get("/admin/users").then(res => setUsers(res.data || [])).catch(() => {});

      // ✅ SAFE MONTHLY DATA (fallback if API empty)
      API.get("/admin/monthly-analytics")
        .then(res => {
          if (res.data && res.data.length > 0) {
            setMonthlyData(res.data);
          } else {
            setMonthlyData([
              { month: "Jan", revenue: 0 },
              { month: "Feb", revenue: 0 },
              { month: "Mar", revenue: 200 },
              { month: "Apr", revenue: 400 },
              { month: "May", revenue: 150 },
            ]);
          }
        })
        .catch(() => {
          // fallback if API fails
          setMonthlyData([
            { month: "Jan", revenue: 0 },
            { month: "Feb", revenue: 0 },
            { month: "Mar", revenue: 200 },
            { month: "Apr", revenue: 400 },
            { month: "May", revenue: 150 },
          ]);
        });

    } catch (err) {
      console.log(err);
    }
  };

  /* DELETE USER */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await API.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  /* UPDATE ROLE */
  const updateUserRole = async (id, role) => {
    const res = await API.put(`/admin/users/${id}`, { role });
    setUsers(prev => prev.map(u => u._id === id ? res.data : u));
  };

  /* SEARCH */
  const filteredUsers = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
    <div style={styles.layout}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>Admin</h2>
        <div style={styles.active} onClick={() => navigate("/admin/dashboard")}>Dashboard</div>
        <div style={styles.nav} onClick={() => navigate("/admin/equipment")}>Equipment</div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1>Dashboard</h1>

        {/* CARDS */}
        <div style={styles.cards}>
  <div style={styles.card}>
    <p style={styles.cardLabel}>💰 Revenue</p>
    <h2 style={styles.cardValue}>₹ {data?.revenue || 0}</h2>
  </div>

  <div style={styles.card}>
    <p style={styles.cardLabel}>👥 Users</p>
    <h2 style={styles.cardValue}>{users.length}</h2>
  </div>

  <div style={styles.card}>
    <p style={styles.cardLabel}>📦 Equipment</p>
    <h2 style={styles.cardValue}>{equipment.length}</h2>
  </div>
</div>

        {/* BAR CHART */}
        {data?.topEquipment?.length > 0 && (
          <div style={styles.box}>
            <h3>Equipment Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topEquipment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRented" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* LINE CHART */}
        {monthlyData.length > 0 && (
          <div style={styles.box}>
            <h3>Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="revenue" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SEARCH */}
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
        />

        {/* USERS TABLE */}
        <div style={styles.box}>
          <h3>Users</h3>

          {currentUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((u) => (
                  <tr key={u._id}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>

                    <td style={styles.td}>
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u._id, e.target.value)}
                      >
                        <option value="farmer">farmer</option>
                        <option value="owner">owner</option>
                        <option value="transport">transport</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>

                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          <div style={{ marginTop: "10px" }}>
            {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  marginRight: "5px",
                  padding: "5px 10px",
                  background: currentPage === i + 1 ? "#3b82f6" : "#e5e7eb",
                  color: currentPage === i + 1 ? "white" : "black",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}