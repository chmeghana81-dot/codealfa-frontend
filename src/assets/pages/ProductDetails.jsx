
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";
import "./ProductDetails.css";

const 127.0.0.1:8000 = import.meta.env.VITE_API_URL


function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setCartMessage("");

      try {
        const response = await API.get(`products/${id}/`);
        setProduct(response.data);
        setQuantity(1);
      } catch (err) {
        console.error("Product details error:", err);
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login to add products to your cart.");
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");

      await API.post("cart/", {
        product: product.id,
        quantity: quantity,
      });

      setCartMessage("Product added to your cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      setCartMessage(
        err.response?.data?.detail ||
        "Unable to add product to cart. Please try again."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <section className="details-message">
        <p>{error}</p>
        <Link to="/products">Back to collection</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="details-message">
        <h2>Product not found</h2>
        <Link to="/products">Explore our collection</Link>
      </section>
    );
  }

  const stock = Number(product.stock) || 0;
  const price = Number(product.price) || 0;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://{127.0.0.1:8000}${product.image}`
    : null;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, stock));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  return (
    <main className="product-details-page">
      <div className="details-container">
        <nav className="details-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Shop</Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <section className="product-details">
          <div className="details-image-panel">
            <div className="details-image">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} />
              ) : (
                <div className="details-placeholder">
                  <span>✦</span>
                  <p>Product image coming soon</p>
                </div>
              )}

              <span className="image-label">MEGASTORE EXCLUSIVE</span>
            </div>
          </div>

          <div className="details-content">
            <p className="details-eyebrow">
              THE MEGASTORE COLLECTION
            </p>

            <span className="details-category">
              {product.category_name || "General Collection"}
            </span>

            <h1>{product.name}</h1>

            <div className="details-rating">
              <span>★★★★★</span>
              <small>Premium collection</small>
            </div>

            <div className="details-price-row">
              <h2>₹{price.toLocaleString("en-IN")}</h2>
              <span className="details-tax-note">
                Inclusive of all taxes
              </span>
            </div>

            <div className="details-divider" />

            <p className="details-description">
              {product.description ||
                "Discover quality, comfort and timeless style with this exclusive MegaStore selection."}
            </p>

            <div
              className={`details-stock ${
                stock > 0 ? "in-stock" : "out-stock"
              }`}
            >
              <span className="stock-dot" />
              {stock > 0
                ? `${stock} items available`
                : "Currently out of stock"}
            </div>

            {stock > 0 && (
              <div className="details-purchase">
                <div className="quantity-control">
                  <span className="quantity-label">Quantity</span>

                  <div className="quantity-buttons">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="details-subtotal">
                  Subtotal:{" "}
                  <strong>
                    ₹{(price * quantity).toLocaleString("en-IN")}
                  </strong>
                </p>
              </div>
            )}

            <div className="details-actions">
              <button
                type="button"
                className="details-cart-btn"
                disabled={stock <= 0 || addingToCart}
                onClick={handleAddToCart}
              >
                <span>🛍</span>
                {addingToCart
                  ? "ADDING..."
                  : stock > 0
                  ? "ADD TO CART"
                  : "OUT OF STOCK"}
              </button>

              <Link
                to="/products"
                className="details-continue-btn"
              >
                Continue Shopping <span>→</span>
              </Link>
            </div>

            {cartMessage && (
              <div
                className={`cart-success-message ${
                  cartMessage.includes("successfully")
                    ? "success"
                    : "failure"
                }`}
              >
                <p>{cartMessage}</p>

                {cartMessage.includes("successfully") && (
                  <Link
                    to="/cart"
                    className="view-cart-highlight"
                  >
                    VIEW MY CART <span>→</span>
                  </Link>
                )}
              </div>
            )}

            <div className="details-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">✧</span>
                <div>
                  <div className="benefit-item">
  <span className="benefit-icon">♡</span>
  <div>
    <strong>Add to Wishlist</strong>
    <small>Save your favourite products</small>
  </div>
</div>
                  <strong>Quality Assured</strong>
                  <small>Carefully selected products</small>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">↗</span>
                <div>
                  <strong>Fast Delivery</strong>
                  <small>Delivered to your doorstep</small>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">◇</span>
                <div>
                  <strong>Secure Shopping</strong>
                  <small>A smooth shopping experience</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="details-bottom-link">
          <Link to="/products">← Back to all products</Link>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
