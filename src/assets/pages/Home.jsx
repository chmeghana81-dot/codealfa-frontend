import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">WELCOME TO MEGASTORE</span>

          <h1>
            Discover Your
            <span> Perfect Style.</span>
          </h1>

          <p>
            Explore our latest collection of fashion,
            accessories, electronics and everyday essentials.
          </p>

          <Link to="/products" className="hero-btn">
            Explore Collection →
          </Link>
        </div>

        <div className="hero-image">
          <div className="hero-circle">M</div>
        </div>
      </section>

      <section className="home-categories">
        <h2>Shop by Category</h2>
        <p>Find everything you need in one place.</p>

        <div className="category-grid">
          <div className="category-card">👕<h3>Fashion</h3></div>
          <div className="category-card">⌚<h3>Accessories</h3></div>
          <div className="category-card">🎧<h3>Electronics</h3></div>
          <div className="category-card">🏠<h3>Home & Living</h3></div>
        </div>
      </section>
    </main>
  );
}

export default Home;