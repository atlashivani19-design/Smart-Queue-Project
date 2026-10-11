import { Link } from "react-router-dom";

function UserDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userName = user?.name || "User";

  return (
    <main className="dashboard-page">

      {/* Background decoration */}

      <div className="dashboard-orb dashboard-orb-one"></div>
      <div className="dashboard-orb dashboard-orb-two"></div>

      {/* HERO */}

      <section className="dashboard-hero">

        <div className="dashboard-badge">
          <span></span>
          SMART QUEUE • USER PORTAL
        </div>

        <h1>
          Welcome back,
          <br />
          <span>{userName}</span>
        </h1>

        <p>
          Manage your queue experience effortlessly.
          Get tokens, track your position and save valuable time.
        </p>

      </section>


      {/* QUICK ACTIONS */}

      <section className="dashboard-actions">

        {/* SERVICES */}

        <Link
          to="/services"
          className="dashboard-card"
        >

          <div className="dashboard-card-top">

            <div className="dashboard-icon blue-icon">
              <span>◈</span>
            </div>

            <span className="card-arrow">
              →
            </span>

          </div>

          <h2>
            Services
          </h2>

          <p>
            Explore available services and choose where
            you want to join the queue.
          </p>

          <div className="card-link">
            Explore services →
          </div>

        </Link>


        {/* GET TOKEN */}

        <Link
          to="/get-token"
          className="dashboard-card featured-card"
        >

          <div className="dashboard-card-top">

            <div className="dashboard-icon white-icon">
              <span>🎟</span>
            </div>

            <span className="card-arrow">
              →
            </span>

          </div>

          <h2>
            Get a Token
          </h2>

          <p>
            Join a digital queue without standing in
            a physical line.
          </p>

          <div className="card-link">
            Generate token →
          </div>

        </Link>


        {/* MY TOKENS */}

        <Link
          to="/my-tokens"
          className="dashboard-card"
        >

          <div className="dashboard-card-top">

            <div className="dashboard-icon blue-icon">
              <span>◉</span>
            </div>

            <span className="card-arrow">
              →
            </span>

          </div>

          <h2>
            My Tokens
          </h2>

          <p>
            View your active tokens and track your
            queue status in real time.
          </p>

          <div className="card-link">
            View my tokens →
          </div>

        </Link>

      </section>


      {/* INFORMATION */}

      <section className="dashboard-info">

        <div className="info-item">

          <strong>
            01
          </strong>

          <div>
            <h3>
              Digital Access
            </h3>

            <p>
              Join queues from anywhere.
            </p>
          </div>

        </div>


        <div className="info-item">

          <strong>
            02
          </strong>

          <div>
            <h3>
              Live Visibility
            </h3>

            <p>
              Know your position in the queue.
            </p>
          </div>

        </div>


        <div className="info-item">

          <strong>
            03
          </strong>

          <div>
            <h3>
              Less Waiting
            </h3>

            <p>
              Arrive when it is almost your turn.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default UserDashboard;