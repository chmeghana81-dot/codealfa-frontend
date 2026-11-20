import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        MegaStore
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/my-orders">My Orders</Link>
        <Link to="/login">Login</Link>
        <Link to="/cart">
          <FaShoppingCart /> Cart
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;