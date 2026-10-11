
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import {
  getServicesByLocation,
  generateToken
} from "../services/api";


function GetToken() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  // Load available locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoadingLocations(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/api/locations"
        );

        if (!response.ok) {
          throw new Error("Unable to load locations.");
        }

        const data = await response.json();
        setLocations(data);

        // Select a location from the URL if supplied
        const locationId = searchParams.get("locationId");

        if (locationId && data.some(
          (location) => String(location.id) === locationId
        )) {
          setSelectedLocation(locationId);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load locations. Please try again.");
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, [searchParams]);

  // Load services whenever the selected location changes
  useEffect(() => {
    if (!selectedLocation) {
      setServices([]);
      setSelectedService("");
      return;
    }

    const loadLocationServices = async () => {
      try {
        setLoadingServices(true);
        setError("");
        setServices([]);
        setSelectedService("");

        const response = await getServicesByLocation(
          selectedLocation
        );

        setServices(response.data);

        // Select a service from the URL if supplied
        const serviceId = searchParams.get("serviceId");

        if (serviceId && response.data.some(
          (service) => String(service.id) === serviceId
        )) {
          setSelectedService(serviceId);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load services for this location.");
      } finally {
        setLoadingServices(false);
      }
    };

    loadLocationServices();
  }, [selectedLocation, searchParams]);

  // Generate token
  const handleGenerate = async () => {
    if (!selectedLocation) {
      setError("Please select a location first.");
      return;
    }

    if (!selectedService) {
      setError("Please select a service first.");
      return;
    }

    if (!user?.id) {
      navigate("/login");
      return;
    }

    try {
      setGenerating(true);
      setError("");

      const response = await generateToken(
        user.id,
        selectedService
      );

      setToken(response.data);
    } catch (err) {
      console.error(err);
      setError(
        typeof err?.response?.data === "string"
          ? err.response.data
          : "Unable to generate token. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Token success screen
  if (token) {
    return (
      <main className="token-page">
        <div className="token-success-card">
          <div className="success-icon">✓</div>

          <div className="success-label">
            TOKEN GENERATED
          </div>

          <h1>You're in the queue!</h1>

          <p>
            Your digital token has been successfully created.
          </p>

          <div className="token-ticket">
            <span>YOUR TOKEN</span>
            <strong>{token.tokenNumber}</strong>

            <div className="token-status">
              <span></span>
              {token.status}
            </div>
          </div>

          <div className="token-meta">
            <div>
              <small>SERVICE</small>
              <strong>
                {token.service?.serviceName || "Service"}
              </strong>
            </div>

            <div>
              <small>STATUS</small>
              <strong>{token.status}</strong>
            </div>
          </div>

          <div className="token-actions">
            <Link
              to="/my-tokens"
              className="primary-token-button"
            >
              Track My Token →
            </Link>

            <Link
              to="/dashboard"
              className="secondary-token-button"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="token-page">
      <div className="token-orb token-orb-one"></div>
      <div className="token-orb token-orb-two"></div>

      <div className="token-wrapper">
        {/* LEFT SECTION */}
        <div className="token-intro">
          <div className="token-badge">
            <span></span>
            DIGITAL QUEUE
          </div>

          <h1>
            Skip the
            <br />
            <span>waiting line.</span>
          </h1>

          <p>
            Choose your location and service to receive
            your digital queue token.
          </p>

          <div className="token-benefits">
            <div>
              <span>✓</span>
              No physical waiting
            </div>

            <div>
              <span>✓</span>
              Track your queue position
            </div>

            <div>
              <span>✓</span>
              Arrive at the right time
            </div>
          </div>
        </div>

        {/* TOKEN FORM */}
        <div className="get-token-card">
          <div className="token-card-label">
            GET YOUR TOKEN
          </div>

          <h2>Join a queue</h2>

          <p>Select your location and required service.</p>

          {/* LOCATION SELECT */}
          <label htmlFor="location">Select Location</label>

          <div className="service-select">
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setError("");
              }}
              disabled={loadingLocations}
            >
              <option value="">
                {loadingLocations
                  ? "Loading locations..."
                  : "Choose a location"}
              </option>

              {locations.map((location) => (
                <option
                  key={location.id}
                  value={location.id}
                >
                  {location.name} — {location.building}
                </option>
              ))}
            </select>
          </div>

          {/* SERVICE SELECT */}
          <label htmlFor="service">Select Service</label>

          <div className="service-select">
            <select
              id="service"
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setError("");
              }}
              disabled={
                !selectedLocation ||
                loadingServices ||
                loadingLocations
              }
            >
              <option value="">
                {!selectedLocation
                  ? "Select a location first"
                  : loadingServices
                    ? "Loading services..."
                    : services.length === 0
                      ? "No services available"
                      : "Choose a service"}
              </option>

              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>

          {selectedLocation && locations.length > 0 && (
            <div className="token-security">
              {locations.find(
                (location) =>
                  String(location.id) === selectedLocation
              )?.building || ""}
              {" · "}
              {locations.find(
                (location) =>
                  String(location.id) === selectedLocation
              )?.floor || ""}
            </div>
          )}

          {error && (
            <div className="token-error">
              {error}
            </div>
          )}

          <button
            className="generate-token-button"
            onClick={handleGenerate}
            disabled={
              loadingLocations ||
              loadingServices ||
              generating ||
              !selectedLocation ||
              !selectedService
            }
          >
            {generating
              ? "Generating..."
              : "Generate My Token"}

            {!generating && <span>→</span>}
          </button>

          <div className="token-security">
            🔒 Your queue information is protected
          </div>
        </div>
      </div>
    </main>
  );
}

export default GetToken;
