import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-placeholder">🛍️</div>
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-category">
          {product.category_name || "General"}
        </p>

        <div className="product-bottom">
          <span className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="view-product-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;