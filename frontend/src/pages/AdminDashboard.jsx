
import { useEffect, useState } from "react";

const API_URL = "https://smart-queue-project-3.onrender.com/api";

function AdminDashboard() {
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load services
  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load services.");
        }
        return response.json();
      })
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Services error:", error);
        setMessage("Unable to load services. Check the backend.");
      });
  }, []);

  // Load queue
  const getQueue = async () => {
    if (!serviceId) {
      setMessage("Please select a service.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/queue/${serviceId}`
      );

      if (!response.ok) {
        throw new Error(`Unable to load queue (${response.status}).`);
      }

      const data = await response.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Queue error:", error);
      setMessage(error.message || "Unable to load queue.");
    } finally {
      setLoading(false);
    }
  };

  // Call next token
  const callNext = async () => {
    if (!serviceId) {
      setMessage("Please select a service.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/admin/next/${serviceId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error(`Unable to call next token (${response.status}).`);
      }

      await getQueue();
    } catch (error) {
      console.error("Call next error:", error);
      setMessage(error.message || "Unable to call next token.");
    } finally {
      setLoading(false);
    }
  };

  // Complete token
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

      await getQueue();
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

      <select
        value={serviceId}
        onChange={(event) => {
          setServiceId(event.target.value);
          setQueue([]);
          setMessage("");
        }}
        style={styles.select}
      >
        <option value="">Select Service</option>

        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.serviceName ?? service.name ?? `Service ${service.id}`}
          </option>
        ))}
      </select>

      <div style={styles.buttons}>
        <button
          onClick={getQueue}
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

      {message && <p style={styles.message}>{message}</p>}

      <h2>Waiting Queue</h2>

      {loading && <p>Loading...</p>}

      {!loading && queue.length === 0 && (
        <p>No queue tokens found.</p>
      )}

      {queue.map((token) => (
        <div key={token.id} style={styles.card}>
          <h3>Token: {token.tokenNumber}</h3>
          <p>User: {token.user?.name ?? "N/A"}</p>
          <p>Status: {token.status}</p>

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
  select: {
    width: "min(100%, 320px)",
    padding: "12px",
    margin: "20px",
    border: "1px solid #d7e2f5",
    borderRadius: "8px",
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
    color: "#dc2626",
    overflowWrap: "anywhere",
  },
};

export default AdminDashboard;
