import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      const user = response.data;

      if (!user || typeof user !== "object") {
        setError("Unexpected server response. Please try again.");
        return;
      }

      // Save the logged-in user's information.
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate according to the user's role.
      if (user.role?.toUpperCase() === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);

      const status = err?.response?.status;
      const data = err?.response?.data;

      let message;

      if (status === 401) {
        message =
          (typeof data?.message === "string" && data.message) ||
          "Invalid email or password.";
      } else if (status === 400) {
        message =
          (typeof data?.message === "string" && data.message) ||
          "Please check your email and password.";
      } else if (status === 403) {
        message = "Access denied. Please check your account permissions.";
      } else if (!err?.response) {
        message =
          "Cannot connect to the server. Make sure the backend is running.";
      } else {
        message =
          (typeof data?.message === "string" && data.message) ||
          "Login failed. Please try again.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      {/* Background effects */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>
      <div className="auth-grid"></div>

      {/* Top navigation */}
      <div className="auth-top">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">Q</span>
          <span>Smart Queue</span>
        </Link>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>
      </div>

      {/* Main authentication section */}
      <section className="auth-container">
        {/* Left information panel */}
        <div className="auth-info">
          <div className="auth-badge">
            <span></span>
            SMART QUEUE PLATFORM
          </div>

          <h1>
            Welcome
            <br />
            <span>back.</span>
            <br />
            Your turn awaits.
          </h1>

          <p>
            Sign in to manage your digital queue, track your
            position and save valuable waiting time.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div>✓</div>
              <span>Access your digital tokens</span>
            </div>

            <div className="auth-feature">
              <div>✓</div>
              <span>Track your queue in real time</span>
            </div>

            <div className="auth-feature">
              <div>✓</div>
              <span>Reach your service at the right time</span>
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-small-label">WELCOME BACK</div>

            <h2>Sign in to Smart Queue</h2>

            <p>Enter your account details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon">@</span>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="login-password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <span>→</span>}
            </button>
          </form>

          {/* Registration link */}
          <div className="auth-login">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </div>

          <div className="secure-text">
            🔒 Secure access to your Smart Queue account
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;