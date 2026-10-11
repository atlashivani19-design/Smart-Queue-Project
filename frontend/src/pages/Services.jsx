import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getServices } from "../services/api";

function Services() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const loadServices = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await getServices();

        setServices(response.data);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load services. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    loadServices();

  }, []);


  return (

    <main className="services-page">

      {/* Background decoration */}

      <div className="services-orb services-orb-one"></div>
      <div className="services-orb services-orb-two"></div>


      {/* HEADER */}

      <section className="services-hero">

        <div className="services-badge">
          <span></span>
          SMART QUEUE SERVICES
        </div>

        <h1>
          Choose a service.
          <br />
          <span>Skip the waiting.</span>
        </h1>

        <p>
          Explore our available services and join a digital
          queue without standing in a physical line.
        </p>

      </section>


      {/* LOADING */}

      {loading && (

        <div className="services-loading">

          <div className="services-spinner"></div>

          <h3>
            Loading services...
          </h3>

          <p>
            Please wait while we fetch the available services.
          </p>

        </div>

      )}


      {/* ERROR */}

      {!loading && error && (

        <div className="services-error">

          <div className="services-error-icon">
            !
          </div>

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </div>

      )}


      {/* EMPTY */}

      {!loading &&
        !error &&
        services.length === 0 && (

          <div className="services-empty">

            <div className="empty-service-icon">
              ◈
            </div>

            <h2>
              No services available
            </h2>

            <p>
              There are currently no queue services available.
            </p>

          </div>

        )}


      {/* SERVICES */}

      {!loading &&
        !error &&
        services.length > 0 && (

          <section className="services-grid">

            {services.map((service, index) => (

              <article
                className="service-card"
                key={service.id}
              >

                {/* CARD TOP */}

                <div className="service-card-top">

                  <div
                    className={`service-icon service-icon-${index % 4}`}
                  >
                    {index === 0
                      ? "🏦"
                      : index === 1
                      ? "🧾"
                      : index === 2
                      ? "💳"
                      : "◈"}
                  </div>

                  <div className="service-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                </div>


                {/* SERVICE NAME */}

                <h2>
                  {service.serviceName}
                </h2>


                {/* DESCRIPTION */}

                <p className="service-description">
                  {service.description ||
                    "Get fast and convenient service through our digital queue system."}
                </p>


                {/* SERVICE STATUS */}

                <div className="service-status">

                  <span className="service-status-dot"></span>

                  <span>
                    Available now
                  </span>

                </div>


                {/* BOTTOM */}

                <div className="service-card-bottom">

                  <span>
                    Digital queue
                  </span>

                  <Link
                    to={`/get-token?serviceId=${service.id}`}
                    className="service-arrow"
                  >
                    →
                  </Link>

                </div>

              </article>

            ))}

          </section>

        )}


      {/* BOTTOM CTA */}

      <section className="services-cta">

        <div>

          <div className="services-cta-label">
            READY TO JOIN?
          </div>

          <h2>
            Your next turn is
            <span> just a click away.</span>
          </h2>

          <p>
            Select a service and generate your digital token
            in seconds.
          </p>

        </div>

        <Link
          to="/get-token"
          className="services-cta-button"
        >
          Get a Token →
        </Link>

      </section>


      {/* FOOTER */}

      <footer className="services-footer">

        <strong>
          Smart Queue
        </strong>

        <span>
          Digital Queue Management System
        </span>

      </footer>

    </main>

  );
}

export default Services;