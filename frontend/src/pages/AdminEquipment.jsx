import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/AdminLayout";

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
  },

  table: { width: "100%" },
  th: { padding: "10px", textAlign: "left" },
  td: { padding: "10px" },

  editBtn: {
    background: "#3b82f6",
    color: "white",
    padding: "5px 10px",
    borderRadius: "6px",
    marginRight: "6px",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    padding: "5px 10px",
    borderRadius: "6px",
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
  addBtn: {
    background: "#22c55e",
    color: "white", 
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    marginBottom: "15px",
    cursor: "pointer",
    fontweight: "500", 
  }, 
};

export default function AdminEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [edit, setEdit] = useState(null);


  useEffect(() => {
    API.get("/admin/equipment").then(res => setEquipment(res.data));
  }, []);

  const deleteItem = async (id) => {
    await API.delete(`/admin/equipment/${id}`);
    setEquipment(prev => prev.filter(e => e._id !== id));
  };

  const updateItem = async () => {
    await API.put(`/admin/equipment/${edit._id}`, edit);
    setEdit(null);
    location.reload();
  };

  return (
    <AdminLayout>
      <h1>Equipment</h1>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {equipment.map(e => (
              <tr key={e._id}>
                <td style={styles.td}>{e.name}</td>
                <td style={styles.td}>₹ {e.pricePerDay}</td>

                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => setEdit(e)}>
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteItem(e._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>Edit</h3>

            <input
              value={edit.name}
              onChange={(e) =>
                setEdit({ ...edit, name: e.target.value })
              }
            />

            <input
              value={edit.pricePerDay}
              onChange={(e) =>
                setEdit({ ...edit, pricePerDay: e.target.value })
              }
            />

            <button onClick={updateItem}>Save</button>
            <button onClick={() => setEdit(null)}>Cancel</button>
          </div>
        </div>
      )}
      
    </AdminLayout>
  );
}