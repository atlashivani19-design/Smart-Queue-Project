import { useEffect, useState } from "react";

function AdminDashboard() {
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error(error));
  }, []);

  const getQueue = () => {
    if (!serviceId) {
      return;
    }

   fetch(
  `https://smart-queue-project-3.onrender.com/api/admin/queue/${serviceId}`
)
      .then((response) => response.json())
      .then((data) => setQueue(data))
      .catch((error) => console.error(error));
  };

  const callNext = () => {
    if (!serviceId) {
      return;
    }

    fetch(
      http://localhost:8080/api/admin/next/${serviceId},
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        getQueue();
      })
      .catch((error) => console.error(error));
  };

  const completeToken = (tokenId) => {
    fetch(
      http://localhost:8080/api/admin/complete/${tokenId},
      {
        method: "PUT",
      }
    )
      .then((response) => response.json())
      .then(() => {
        getQueue();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Service</option>

        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.serviceName}
          </option>
        ))}
      </select>

      <div style={styles.buttons}>
        <button onClick={getQueue} style={styles.blueButton}>
          View Queue
        </button>

        <button onClick={callNext} style={styles.greenButton}>
          Call Next
        </button>
      </div>

      <h2>Waiting Queue</h2>

      {queue.length === 0 ? (
        <p>No waiting tokens.</p>
      ) : (
        <div>
          {queue.map((token) => (
            <div key={token.id} style={styles.card}>
              <h3>Token: {token.tokenNumber}</h3>

              <p>User: {token.user?.name}</p>

              <p>Status: {token.status}</p>

              <button
                onClick={() => completeToken(token.id)}
                style={styles.completeButton}
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },

  select: {
    width: "300px",
    padding: "12px",
    margin: "20px",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
};

export default AdminDashboard;import { useEffect, useState } from "react";

function AdminDashboard() {
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error(error));
  }, []);

  const getQueue = () => {
    if (!serviceId) {
      return;
    }

    fetch(
      http://localhost:8080/api/admin/queue/${serviceId}
    )
      .then((response) => response.json())
      .then((data) => setQueue(data))
      .catch((error) => console.error(error));
  };

  const callNext = () => {
    if (!serviceId) {
      return;
    }

    fetch(
      http://localhost:8080/api/admin/next/${serviceId},
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        getQueue();
      })
      .catch((error) => console.error(error));
  };

  const completeToken = (tokenId) => {
    fetch(
      http://localhost:8080/api/admin/complete/${tokenId},
      {
        method: "PUT",
      }
    )
      .then((response) => response.json())
      .then(() => {
        getQueue();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Service</option>

        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.serviceName}
          </option>
        ))}
      </select>

      <div style={styles.buttons}>
        <button onClick={getQueue} style={styles.blueButton}>
          View Queue
        </button>

        <button onClick={callNext} style={styles.greenButton}>
          Call Next
        </button>
      </div>

      <h2>Waiting Queue</h2>

      {queue.length === 0 ? (
        <p>No waiting tokens.</p>
      ) : (
        <div>
          {queue.map((token) => (
            <div key={token.id} style={styles.card}>
              <h3>Token: {token.tokenNumber}</h3>

              <p>User: {token.user?.name}</p>

              <p>Status: {token.status}</p>

              <button
                onClick={() => completeToken(token.id)}
                style={styles.completeButton}
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },

  select: {
    width: "300px",
    padding: "12px",
    margin: "20px",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },
};

export default AdminDashboard;