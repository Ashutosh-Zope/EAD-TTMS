import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/api/users/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error);
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔥 Add handleLogout function
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* 🔥 Pass handleLogout to Sidebar */}
      <Sidebar onLogout={handleLogout} isAdmin={true} />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#1e293b",
          }}
        >
          User Management
        </h1>

        {/* Table Section */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            overflowY: "auto",
            width: "100%",
            transition: "0.3s",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ backgroundColor: "#e0f2fe" }}>
              <tr>
                <th style={styles.columnHead}>Name</th>
                <th style={styles.columnHead}>Phone</th>
                <th style={styles.columnHead}>Created At</th>
                <th style={styles.columnHead}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={index}
                  style={{ backgroundColor: "#ffffff", transition: "0.3s" }}
                >
                  <td style={styles.cell}>{user.name}</td>
                  <td style={styles.cell}>{user.phone}</td>
                  <td style={styles.cell}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Invalid Date"}
                  </td>
                  <td style={styles.cell}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <button style={styles.promoteButton}>Promote</button>
                      <button style={styles.deleteButton}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "nowrap",
            flexDirection: "row",
          }}
        >
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => paginate(idx + 1)}
              style={{
                padding: "0.4rem 0.8rem",
                minWidth: "32px",
                height: "32px",
                borderRadius: "999px",
                border: "1px solid #60a5fa",
                backgroundColor: currentPage === idx + 1 ? "#60a5fa" : "white",
                color: currentPage === idx + 1 ? "white" : "#3b82f6",
                fontWeight: "600",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3b82f6";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor =
                  currentPage === idx + 1 ? "#60a5fa" : "white";
                e.target.style.color =
                  currentPage === idx + 1 ? "white" : "#3b82f6";
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  columnHead: {
    padding: "16px",
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "center",
    color: "#0f172a",
    backgroundColor: "#e0f2fe",
    borderBottom: "2px solid #bae6fd",
    letterSpacing: "0.5px",
    textTransform: "capitalize",
  },
  cell: {
    padding: "14px",
    textAlign: "center",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "white",
    borderBottom: "1px solid #e5e7eb",
    transition: "0.3s",
  },
  promoteButton: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
};

export default ViewUsers;
