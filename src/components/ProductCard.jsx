import { Link } from "react-router-dom";
import "./ProductCard.css";



function ProductCard({ product }) {
  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://{127.0.0.1:8000}${product.image}`
    : "";

  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-image"
        aria-label={`View ${product.name}`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder">
            <span>🛍️</span>
            <small>Image coming soon</small>
          </div>
        )}

        <span className="product-category-badge">
          {product.category_name || "Collection"}
        </span>
      </Link>

      <div className="product-info">
        <p className="product-category">MEGASTORE COLLECTION</p>
        <h3>{product.name}</h3>

        <div className="product-bottom">
          <span className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          <Link to={`/products/${product.id}`} className="view-product-btn">
            View Details <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
