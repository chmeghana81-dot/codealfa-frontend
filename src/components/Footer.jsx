import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h2>MegaStore</h2>
          <p>Discover your style. Shop with confidence.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/login">Login</a>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: support@megastore.com</p>
          <p>Customer Support: 24/7</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MegaStore. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;