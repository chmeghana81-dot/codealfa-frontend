import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const categories = [
  {
    name: "Men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600"
  },
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
  },
  {
    name: "Kids",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=600"
  },
  {
    name: "Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
  },
  {
    name: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600"
  }
];

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("products/")
      .then((response) => {
        const data = response.data;
        setProducts(Array.isArray(data) ? data.slice(0, 4) : data.results?.slice(0, 4) || []);
      })
      .catch((error) => console.error("Products loading failed:", error));
  }, []);

  return (
    <main className="premium-home">
      <section className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-tag">THE NEW COLLECTION</span>
            <h1>Discover Premium <span>Style.</span></h1>
            <p>
              Explore timeless fashion, elegant accessories and
              everyday essentials. Your style, our collection.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="shop-now-btn">Shop Now</Link>
              <Link to="/products" className="new-arrivals-btn">Explore Collection</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-strip">
        <div className="benefit-item">
          <span>🛡️</span>
          <div><h3>Authentic Products</h3><p>Quality you can trust</p></div>
        </div>
        <div className="benefit-item">
          <span>🚚</span>
          <div><h3>Fast Shipping</h3><p>Delivered to your doorstep</p></div>
        </div>
        <div className="benefit-item">
          <span>💳</span>
          <div><h3>Secure Payments</h3><p>Safe shopping experience</p></div>
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">EXPLORE OUR COLLECTION</span>
            <h2>Shop by Category</h2>
          </div>
          <Link to="/products">View All →</Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link to="/products" className="category-card" key={category.name}>
              <img src={category.image} alt={category.name} />
              <div className="category-overlay">
                <h3>{category.name}</h3>
                <span>Discover →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">HANDPICKED FOR YOU</span>
            <h2>Featured Products</h2>
          </div>
          <Link to="/products">Shop All →</Link>
        </div>

        <div className="featured-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="featured-message">
              Our collection is loading. Please visit the Shop page.
            </p>
          )}
        </div>
      </section>

      <section className="newsletter-section">
        <span>MEGASTORE EXCLUSIVE</span>
        <h2>Style that speaks for you.</h2>
        <p>Discover your favourites and make every moment stylish.</p>
        <Link to="/products" className="shop-now-btn">Explore Now</Link>
      </section>
    </main>
  );
}

export default Home;
