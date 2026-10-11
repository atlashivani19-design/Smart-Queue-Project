import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">

        <span className="logo-icon">
          Q
        </span>

        Smart Queue

      </Link>

      <div className="nav-links">

        <Link to="/" className="nav-link">
          Home
        </Link>

        {user && (
          <>
            <Link
              to="/dashboard"
              className="nav-link"
            >
              Dashboard
            </Link>

            <Link
              to="/services"
              className="nav-link"
            >
              Services
            </Link>

            <Link
              to="/my-tokens"
              className="nav-link"
            >
              My Tokens
            </Link>
          </>
        )}

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="nav-link"
          >
            Admin
          </Link>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="nav-button"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="nav-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="nav-button"
            >
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;