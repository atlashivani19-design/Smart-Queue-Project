
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name,
        email,
        password: form.password,
      });

      alert("Registration successful! Please sign in.");
      navigate("/login");
    } catch (err) {
      console.error(
        "Registration failed:",
        err?.response?.data || err
      );

      const responseData = err?.response?.data;

      let message = "Registration failed. Please try again.";

      if (typeof responseData === "string" && responseData.trim()) {
        message = responseData;
      } else if (typeof responseData?.message === "string") {
        message = responseData.message;
      } else if (typeof responseData?.error === "string") {
        message = responseData.error;
      } else if (!err.response) {
        message = "Cannot connect to the server. Check that the backend is running.";
      } else if (err.response.status === 409) {
        message = "This email is already registered. Please sign in.";
      } else if (err.response.status === 400) {
        message = "Please check your registration details.";
      } else if (err.response.status >= 500) {
        message = "The server encountered an error. Please check the backend terminal.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>
      <div className="auth-grid"></div>

      <div className="auth-top">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">Q</span>
          <span>Smart Queue</span>
        </Link>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>
      </div>

      <section className="auth-container">
        <div className="auth-info">
          <div className="auth-badge">
            <span></span>
            DIGITAL QUEUE PLATFORM
          </div>

          <h1>
            Join the
            <br />
            <span>smarter way</span>
            <br />
            to wait.
          </h1>

          <p>
            Create your Smart Queue account and manage
            your waiting experience digitally.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div>✓</div>
              <span>Get digital queue tokens</span>
            </div>

            <div className="auth-feature">
              <div>✓</div>
              <span>Track your position in real time</span>
            </div>

            <div className="auth-feature">
              <div>✓</div>
              <span>Save valuable waiting time</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-small-label">
              CREATE ACCOUNT
            </div>

            <h2>Welcome to Smart Queue</h2>
            <p>Create your account to get started.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon">@</span>

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-login">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <div className="secure-text">
            🔒 Your information is securely protected
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
