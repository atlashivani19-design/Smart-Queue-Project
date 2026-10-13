

import { useEffect, useState } from "react";

const API_URL = "https://smart-queue-project-3.onrender.com/api";

function AdminDashboard() {
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load services from Render
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);

        if (!response.ok) {
          throw new Error(`Services request failed: ${response.status}`);
        }

        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Services error:", error);
        setMessage("Unable to load services. Please try again.");
      }
    };

    loadServices();
  }, []);

  // Load the waiting queue
  const getQueue = async (selectedServiceId = serviceId) => {
    if (!selectedServiceId) {
      setMessage("Please select a service first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/queue/${selectedServiceId}`
      );

      if (!response.ok) {
        throw new Error(`Unable to load queue (${response.status}).`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected queue response.");
      }

      setQueue(data);
      setMessage(
        data.length === 0
          ? "There are no waiting tokens for this service."
          : `Loaded ${data.length} waiting token(s).`
      );
    } catch (error) {
      console.error("Queue error:", error);
      setQueue([]);
      setMessage(error.message || "Unable to load queue.");
    } finally {
      setLoading(false);
    }
  };

  // Call the next waiting token
  const callNext = async () => {
    if (!serviceId) {
      setMessage("Please select a service first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/next/${serviceId}`,
        { method: "POST" }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || `Request failed: ${response.status}`);
      }

      setMessage(
        result.includes("No waiting tokens")
          ? "There are no waiting tokens."
          : "Next token called successfully."
      );

      // Reload the waiting queue
      await getQueue(serviceId);
    } catch (error) {
      console.error("Call next error:", error);
      setMessage(error.message || "Unable to call the next token.");
    } finally {
      setLoading(false);
    }
  };

  // Complete a token
  const completeToken = async (tokenId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/complete/${tokenId}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error(`Unable to complete token (${response.status}).`);
      }

      setMessage("Token completed successfully.");

      await getQueue(serviceId);
    } catch (error) {
      console.error("Complete token error:", error);
      setMessage(error.message || "Unable to complete token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <p>Manage services and waiting tokens.</p>

      <label htmlFor="service" style={styles.label}>
        Select Service
      </label>

      <select
        id="service"
        value={serviceId}
        onChange={(event) => {
          setServiceId(event.target.value);
          setQueue([]);
          setMessage("");
        }}
        style={styles.select}
      >
        <option value="">Choose a service</option>

        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.serviceName ?? service.name ?? `Service ${service.id}`}
          </option>
        ))}
      </select>

      <div style={styles.buttons}>
        <button
          onClick={() => getQueue()}
          disabled={loading}
          style={styles.blueButton}
        >
          View Queue
        </button>

        <button
          onClick={callNext}
          disabled={loading}
          style={styles.greenButton}
        >
          Call Next
        </button>
      </div>

      {message && (
        <p role="status" style={styles.message}>
          {message}
        </p>
      )}

      <h2>Waiting Queue</h2>

      {loading && <p>Loading...</p>}

      {!loading && queue.length === 0 && (
        <p>No waiting tokens to display.</p>
      )}

      {queue.map((token) => (
        <div key={token.id} style={styles.card}>
          <h3>Token: {token.tokenNumber ?? token.id}</h3>
          <p>User: {token.user?.name ?? "N/A"}</p>
          <p>Status: {token.status ?? "Unknown"}</p>

          <button
            onClick={() => completeToken(token.id)}
            disabled={loading}
            style={styles.completeButton}
          >
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    minHeight: "70vh",
    background: "#f4f7ff",
    fontFamily: "Arial, sans-serif",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginTop: "20px",
  },
  select: {
    width: "min(100%, 320px)",
    padding: "12px",
    margin: "12px",
    border: "1px solid #d7e2f5",
    borderRadius: "8px",
    background: "white",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  blueButton: {
    padding: "12px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  greenButton: {
    padding: "12px 20px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  completeButton: {
    padding: "8px 15px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  card: {
    maxWidth: "600px",
    margin: "15px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  message: {
    color: "#334155",
    overflowWrap: "anywhere",
  },
};

export default AdminDashboard;
