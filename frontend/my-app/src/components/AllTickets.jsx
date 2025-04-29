import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001/api";

function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }
    fetch(`${API_BASE}/tickets/all`)
      .then((r) => r.json())
      .then((data) => {
        setTickets(data);
        setFilteredTickets(data);
      })
      .catch(console.error);
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const getSortedTickets = () => {
    let sortableTickets = [...filteredTickets];

    if (priorityFilter) {
      sortableTickets = sortableTickets.filter(
        (ticket) => ticket.priority?.toLowerCase() === priorityFilter
      );
    }
    if (statusFilter) {
      sortableTickets = sortableTickets.filter(
        (ticket) => ticket.status?.toLowerCase() === statusFilter
      );
    }
    if (searchTerm) {
      sortableTickets = sortableTickets.filter((ticket) =>
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return sortableTickets;
  };

  const sortedTickets = getSortedTickets();
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = sortedTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(sortedTickets.length / ticketsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f1f5f9",
      }}
    >
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} isAdmin={true} />

      {/* Main Tickets Page */}
      <main style={{ flexGrow: 1, padding: "1rem", overflowY: "auto" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "#1e293b",
          }}
        >
          Ticket Management
        </h1>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: "0.5rem", borderRadius: "8px" }}
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: "0.5rem", borderRadius: "8px" }}
          >
            <option value="">Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: "0.5rem", borderRadius: "8px", width: "200px" }}
          />
        </div>

        {/* Tickets Table */}
        <div
          style={{
            overflowX: "auto",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#3b82f6", color: "white" }}>
                <th style={styles.tableHeader}>Ticket ID</th>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Priority</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Department</th>
                <th style={styles.tableHeader}>Assigned</th>
                <th style={styles.tableHeader}>Created At</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTickets.map((ticket) => (
                <tr
                  key={ticket.ticketId}
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <td style={styles.cell}>{ticket.ticketId}</td>
                  <td style={styles.cell}>{ticket.description || "N/A"}</td>
                  <td style={styles.cell}>
                    <span
                      style={{
                        ...styles.priorityBadge,
                        ...priorityBadgeStyle(ticket.priority),
                      }}
                    >
                      {ticket.priority || "N/A"}
                    </span>
                  </td>
                  <td style={styles.cell}>{ticket.status || "N/A"}</td>
                  <td style={styles.cell}>{ticket.department || "N/A"}</td>
                  <td style={styles.cell}>{ticket.assignedTo || "N/A"}</td>
                  <td style={styles.cell}>
                    {ticket.createdAt?.slice(0, 10) || "N/A"}
                  </td>
                  <td style={styles.cell}>
                    <button style={styles.editButton}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => paginate(idx + 1)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "2px solid #3b82f6",
                backgroundColor: currentPage === idx + 1 ? "#3b82f6" : "white",
                color: currentPage === idx + 1 ? "white" : "#3b82f6",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

// Styles
const styles = {
  tableHeader: {
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  cell: {
    padding: "10px",
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#1e293b",
  },
  editButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  priorityBadge: {
    display: "inline-block",
    padding: "0.3rem 0.7rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
};

const priorityBadgeStyle = (priority) => ({
  backgroundColor:
    priority === "low"
      ? "#22c55e"
      : priority === "medium"
      ? "#facc15"
      : priority === "high"
      ? "#ef4444"
      : "#e2e8f0",
  color: priority === "medium" ? "black" : "white",
});

export default AllTickets;
