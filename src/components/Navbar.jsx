import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaShippingFast
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="announcement-bar">
        <span>
          <FaShippingFast /> FREE SHIPPING ON ORDERS ABOVE ₹999
        </span>
        <span>PREMIUM COLLECTION | NEW ARRIVALS</span>
      </div>

      <nav className="navbar">
        <Link to={isAuthenticated ? "/" : "/register"} className="logo">
          <span className="logo-main">
            MEGA<span>STORE</span>
          </span>
          <small>STYLE THAT DEFINES YOU</small>
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/products">Shop</NavLink>
              <NavLink to="/my-orders">My Orders</NavLink>
              <NavLink to="/cart" className="cart-link">
                <FaShoppingCart /> Cart
              </NavLink>
              <span className="account-link">
                <FaUserCircle /> {user?.username || "Account"}
              </span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/login" className="account-link">
                <FaUserCircle /> Login
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
