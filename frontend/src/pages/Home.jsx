import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">

      {/* BACKGROUND EFFECTS */}

      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="grid-background"></div>

      {/* HERO */}

      <section className="hero-new">

        <div className="hero-left">

          <div className="status-pill">
            <span className="status-dot"></span>
            SMART QUEUE PLATFORM
          </div>

          <h1>
            Your time is
            <br />

            <span>too valuable</span>

            <br />

            to stand in line.
          </h1>

          <p className="hero-description">
            Get a digital token, track your position in real
            time and arrive exactly when it's your turn.
          </p>

          <div className="hero-actions">

            <Link
              to="/register"
              className="main-cta"
            >
              Get Your Token
              <span>→</span>
            </Link>

            <Link
              to="/login"
              className="outline-cta"
            >
              Sign in
            </Link>

          </div>

          <div className="trust-row">

            <div className="avatars">
              <span>U</span>
              <span>A</span>
              <span>S</span>
              <span>+</span>
            </div>

            <div>
              <strong>Easy digital queue</strong>
              <small>Simple. Fast. Stress-free.</small>
            </div>

          </div>

        </div>

        {/* DIGITAL TICKET */}

        <div className="hero-right">

          <div className="ticket-glow"></div>

          <div className="ticket">

            <div className="ticket-header">

              <div>
                <small>SMART QUEUE</small>
                <strong>Digital Token</strong>
              </div>

              <div className="live-badge">
                <span></span>
                LIVE
              </div>

            </div>

            <div className="ticket-service">
              <span>NOW SERVING</span>
              <strong>A-20</strong>
            </div>

            <div className="ticket-number">
              <small>YOUR TOKEN</small>

              <strong>A-24</strong>

              <span>Waiting</span>
            </div>

            <div className="ticket-progress">

              <div className="progress-info">
                <span>Queue progress</span>
                <strong>68%</strong>
              </div>

              <div className="progress-bar">
                <div></div>
              </div>

            </div>

            <div className="ticket-details">

              <div>
                <small>PEOPLE AHEAD</small>
                <strong>03</strong>
              </div>

              <div>
                <small>EST. WAIT</small>
                <strong>09 min</strong>
              </div>

              <div>
                <small>COUNTER</small>
                <strong>04</strong>
              </div>

            </div>

            <div className="ticket-footer">
              Please be ready when your token is called.
            </div>

          </div>

          <div className="floating-card card-one">
            <span>⚡</span>
            <div>
              <strong>Fast service</strong>
              <small>Less waiting</small>
            </div>
          </div>

          <div className="floating-card card-two">
            <span>✓</span>
            <div>
              <strong>Queue confirmed</strong>
              <small>Token A-24</small>
            </div>
          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="stats-section">

        <div className="stat">
          <strong>24/7</strong>
          <span>Digital access</span>
        </div>

        <div className="stat">
          <strong>01</strong>
          <span>Digital token</span>
        </div>

        <div className="stat">
          <strong>100%</strong>
          <span>Queue visibility</span>
        </div>

        <div className="stat">
          <strong>0</strong>
          <span>Long physical lines</span>
        </div>

      </section>

      {/* FEATURES */}

      <section className="features-new">

        <div className="section-intro">

          <div className="section-label">
            WHY SMART QUEUE
          </div>

          <h2>
            Everything you need
            <br />
            to manage waiting smarter.
          </h2>

          <p>
            A complete digital queue experience for
            customers, staff and administrators.
          </p>

        </div>

        <div className="feature-grid-new">

          <div className="feature-big">

            <div className="feature-number">
              01
            </div>

            <div className="feature-symbol">
              🎟️
            </div>

            <h3>
              Digital Tokens
            </h3>

            <p>
              Join a queue digitally and receive your
              token without standing in a physical line.
            </p>

            <div className="feature-arrow">
              →
            </div>

          </div>

          <div className="feature-big">

            <div className="feature-number">
              02
            </div>

            <div className="feature-symbol">
              📡
            </div>

            <h3>
              Live Queue Tracking
            </h3>

            <p>
              Know exactly where you are in the queue
              and how many people are ahead.
            </p>

            <div className="feature-arrow">
              →
            </div>

          </div>

          <div className="feature-big">

            <div className="feature-number">
              03
            </div>

            <div className="feature-symbol">
              📊
            </div>

            <h3>
              Smart Administration
            </h3>

            <p>
              Manage services, call tokens and monitor
              the entire queue from one place.
            </p>

            <div className="feature-arrow">
              →
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="final-cta">

        <div>

          <div className="section-label">
            READY WHEN YOU ARE
          </div>

          <h2>
            Stop waiting.
            <br />
            Start moving.
          </h2>

          <p>
            Create your Smart Queue account and
            experience a better way to wait.
          </p>

          <Link
            to="/register"
            className="main-cta"
          >
            Create Free Account
            <span>→</span>
          </Link>

        </div>

        <div className="cta-circle">
          <span>Q</span>
        </div>

      </section>

      <footer className="footer">
        <strong>Smart Queue</strong>
        <span>Digital Queue Management System</span>
      </footer>

    </main>
  );
}

export default Home;