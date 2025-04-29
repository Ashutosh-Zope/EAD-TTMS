import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const EditTicket = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const init = location.state || {};
  const [subject, setSubject] = useState(init.title || "");
  const [description, setDescription] = useState(init.description || "");
  const [priority, setPriority] = useState(init.priority || "medium");
  const [status, setStatus] = useState(init.status || "open");

  useEffect(() => {
    if (!location.state) {
      fetch(`http://localhost:5001/api/tickets/${email}`)
        .then((res) => res.json())
        .then((items) => {
          const t = items.find((x) => x.ticketId === ticketId);
          if (t) {
            setSubject(t.title);
            setDescription(t.description);
            setPriority(t.priority);
            setStatus(t.status);
          }
        })
        .catch(console.error);
    }
  }, [location.state, ticketId, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title: subject, description, priority, status };
    try {
      const res = await fetch(`http://localhost:5001/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.message}`);
        return;
      }
      alert("Ticket updated!");
      const role = localStorage.getItem("userRole");
      navigate(role === "admin" ? "/all-tickets" : "/dashboard");
    } catch (err) {
      console.error(err);
      alert("Could not update ticket");
    }
  };

  const handleCancel = () => {
    const role = localStorage.getItem("userRole");
    navigate(role === "admin" ? "/all-tickets" : "/dashboard");
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <Sidebar
        onLogout={() => {
          localStorage.clear();
          navigate("/");
        }}
        isAdmin={true}
      />

      {/* Main Content */}
      <div
        style={{
          flexGrow: 1,
          background: "linear-gradient(to bottom right, #7ee8fa, #eec0c6)",
          padding: "2rem",
          overflowY: "auto",
          height: "100vh", // full height
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#1e293b",
            fontSize: "2.5rem",
            fontWeight: "700",
          }}
        >
          Edit Ticket
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
            padding: "2.5rem",
            width: "100%",
            height: "100%", // Full height inside container
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Ticket Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Ticket Description</label>
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={styles.label}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button type="submit" style={styles.updateButton}>
              Update Ticket
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 🎨 Styles
const styles = {
  formGroup: {
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },
  formRow: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  },
  label: {
    fontWeight: "600",
    marginBottom: "0.7rem",
    color: "#374151",
    fontSize: "1rem",
  },
  input: {
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  textarea: {
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    resize: "vertical",
  },
  select: {
    width: "100%",
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  updateButton: {
    flex: 1,
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: "#6366f1",
    color: "white",
    fontWeight: "700",
    fontSize: "1.1rem",
    border: "none",
    cursor: "pointer",
  },
  cancelButton: {
    flex: 1,
    padding: "1rem",
    borderRadius: "10px",
    backgroundColor: "#f3f4f6",
    color: "#111827",
    fontWeight: "700",
    fontSize: "1.1rem",
    border: "none",
    cursor: "pointer",
  },
};

export default EditTicket;
