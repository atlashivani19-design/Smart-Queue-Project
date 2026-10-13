
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = "https://smart-queue-project-3.onrender.com/api";

function GetToken() {
  const [searchParams] = useSearchParams();

  const [locationId, setLocationId] = useState("");
  const [serviceId, setServiceId] = useState(
    searchParams.get("serviceId") || ""
  );

  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load locations
  useEffect(() => {
    fetch(`${API_URL}/locations`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load locations.");
        }
        return response.json();
      })
      .then((data) => {
        setLocations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Locations error:", err);
        setError("Unable to load locations. Please try again.");
      });
  }, []);

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
        const list = Array.isArray(data) ? data : [];
        setServices(list);

        const requestedId = searchParams.get("serviceId");

        if (
          requestedId &&
          list.some((service) => String(service.id) === requestedId)
        ) {
          setServiceId(requestedId);
        }
      })
      .catch((err) => {
        console.error("Services error:", err);
        setError("Unable to load services. Please try again.");
      });
  }, [searchParams]);

  // Generate token
  const handleGenerateToken = async (event) => {
    event.preventDefault();

    if (!locationId || !serviceId) {
      setError("Please select a location and service.");
      return;
    }

    // This assumes login stores the user object under "user".
    let user;

    try {
      const storedUser = localStorage.getItem("user");
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      setError("Unable to read your login details. Please log in again.");
      return;
    }

    const userId = user?.id ?? user?.userId;

    if (!userId) {
      setError("Please log in first to generate a token.");
      return;
    }

    setLoading(true);
    setError("");
    setToken(null);

    try {
      const params = new URLSearchParams({
        userId: String(userId),
        serviceId: String(serviceId),
      });

      const response = await fetch(
        `${API_URL}/tokens?${params.toString()}`,
        { method: "POST" }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          result || `Token request failed (${response.status}).`
        );
      }

      let data;

      try {
        data = JSON.parse(result);
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      setToken(data);
    } catch (err) {
      console.error("Token generation error:", err);
      setError(err.message || "Unable to generate your token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.intro}>
        <span style={styles.badge}>● DIGITAL QUEUE</span>

        <h1 style={styles.heading}>
          Skip the <span style={styles.highlight}>waiting line.</span>
        </h1>

        <p style={styles.introText}>
          Choose your location and service to receive your digital queue token.
        </p>

        <ul style={styles.features}>
          <li>✓ &nbsp; No physical waiting</li>
          <li>✓ &nbsp; Track your queue position</li>
          <li>✓ &nbsp; Arrive at the right time</li>
        </ul>
      </section>

      <section style={styles.card}>
        <p style={styles.label}>GET YOUR TOKEN</p>
        <h2 style={styles.subheading}>Join a queue</h2>

        <p style={styles.subtitle}>
          Select your location and required service.
        </p>

        <form onSubmit={handleGenerateToken}>
          <label style={styles.fieldLabel} htmlFor="location">
            Select Location
          </label>

          <select
            id="location"
            value={locationId}
            onChange={(event) => {
              setLocationId(event.target.value);
              setError("");
              setToken(null);
            }}
            style={styles.select}
            required
          >
            <option value="">Choose a location</option>

            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name ??
                  location.locationName ??
                  location.address ??
                  `Location ${location.id}`}
              </option>
            ))}
          </select>

          <label style={styles.fieldLabel} htmlFor="service">
            Select Service
          </label>

          <select
            id="service"
            value={serviceId}
            onChange={(event) => {
              setServiceId(event.target.value);
              setError("");
              setToken(null);
            }}
            style={styles.select}
            required
          >
            <option value="">Choose a service</option>

            {services
              .filter(
                (service) =>
                  !locationId ||
                  String(service.locationId ?? service.location?.id) ===
                    String(locationId)
              )
              .map((service) => (
                <option key={service.id} value={service.id}>
                  {service.serviceName ??
                    service.name ??
                    `Service ${service.id}`}
                </option>
              ))}
          </select>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate My Token"}
          </button>
        </form>

        {token && (
          <div style={styles.tokenCard}>
            <p>Your token number</p>
            <h2>
              {token.tokenNumber ?? token.token ?? token.id ?? "Created"}
            </h2>
            <p>Status: {token.status ?? "Waiting"}</p>
          </div>
        )}

        <p style={styles.footer}>
          🔒 Your queue information is handled securely.
        </p>
      </section>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    gap: "40px",
    padding: "50px 5%",
    background: "#f4f7ff",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  intro: {
    flex: "1 1 350px",
    maxWidth: "600px",
  },
  badge: {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "30px",
    background: "#e5efff",
    color: "#2563eb",
    fontWeight: "bold",
    letterSpacing: "2px",
    fontSize: "13px",
  },
  heading: {
    color: "#102143",
    fontSize: "clamp(36px, 5vw, 64px)",
    lineHeight: 1.05,
    margin: "30px 0 20px",
  },
  highlight: {
    display: "block",
    color: "#2563eb",
  },
  introText: {
    color: "#718096",
    fontSize: "18px",
    lineHeight: 1.7,
  },
  features: {
    listStyle: "none",
    padding: 0,
    lineHeight: "3",
    color: "#334e75",
    fontWeight: "bold",
  },
  card: {
    flex: "1 1 320px",
    maxWidth: "440px",
    padding: "35px",
    borderRadius: "26px",
    background: "#ffffff",
    boxShadow: "0 20px 60px rgba(30, 64, 175, 0.12)",
    boxSizing: "border-box",
  },
  label: {
    color: "#2563eb",
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  subheading: {
    color: "#102143",
    fontSize: "30px",
    marginBottom: "12px",
  },
  subtitle: {
    color: "#718096",
    lineHeight: 1.6,
    marginBottom: "25px",
  },
  fieldLabel: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#334155",
  },
  select: {
    width: "100%",
    padding: "14px",
    border: "1px solid #d7e2f5",
    borderRadius: "12px",
    background: "#ffffff",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    background: "#fff1f2",
    padding: "12px",
    borderRadius: "8px",
    overflowWrap: "anywhere",
  },
  tokenCard: {
    marginTop: "20px",
    padding: "20px",
    textAlign: "center",
    background: "#eff6ff",
    borderRadius: "12px",
    color: "#1e40af",
  },
  footer: {
    marginTop: "25px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "13px",
  },
};

export default GetToken;
