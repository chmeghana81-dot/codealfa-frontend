import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("cart/");
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setLoading(false);
      setError("Please log in to view your shopping cart.");
      return;
    }
    loadCart();
  }, [loadCart]);

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return;
    try {
      setBusyId(item.id);
      setError("");
      const response = await API.patch(`cart/items/${item.id}/`, { quantity });
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to update quantity.");
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setBusyId(itemId);
      setError("");
      const response = await API.delete(`cart/items/${itemId}/`);
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || "Unable to remove this product.");
    } finally {
      setBusyId(null);
    }
  };

  const money = (value) => Number(value || 0).toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2,
  });

  const items = cart?.items || [];
  const total = Number(cart?.total_price || 0);

  if (loading) return <main className="cart-page"><p>Loading your cart...</p></main>;

  if (error && !cart) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <h1>Your shopping cart</h1>
          <p>{error}</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="cart-eyebrow">YOUR SELECTION</span>
          <h1>Shopping Cart</h1>
          <p>{items.length} product(s) in your cart</p>
        </div>
        <Link to="/products" className="cart-continue">← Continue shopping</Link>
      </div>

      {error && <div className="cart-error" role="alert">{error}</div>}

      {items.length === 0 ? (
        <section className="cart-empty">
          <div className="cart-empty-icon">♡</div>
          <h2>Your cart is waiting</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="cart-shop-button">Explore products</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {items.map((item) => {
              const image = item.product_image;
              const imageUrl = image
                ? image.startsWith("http") ? image : `https://{127.0.0.1:8000}${image}`
                : "";

              return (
                <article className="cart-item" key={item.id}>
                  <div className="cart-product-image">
                    {imageUrl ? <img src={imageUrl} alt={item.product_name} /> : <span>MEGA</span>}
                  </div>
                  <div className="cart-product-info">
                    <h3>{item.product_name}</h3>
                    <p className="cart-unit-price">{money(item.product_price)}</p>

                    {(item.selected_size || item.selected_color) && (
                      <p className="cart-variant">
                        {item.selected_size && <span>Size: {item.selected_size}</span>}
                        {item.selected_color && <span>Colour: {item.selected_color}</span>}
                      </p>
                    )}

                    <div className="cart-quantity">
                      <button disabled={busyId === item.id || item.quantity <= 1}
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        aria-label="Decrease quantity">−</button>
                      <strong>{item.quantity}</strong>
                      <button disabled={busyId === item.id ||
                        (item.product_stock != null && item.quantity >= item.product_stock)}
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        aria-label="Increase quantity">+</button>
                    </div>

                    <button className="cart-remove" disabled={busyId === item.id}
                      onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                  <strong className="cart-item-subtotal">{money(item.subtotal)}</strong>
                </article>
              );
            })}
          </section>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="cart-summary-row"><span>Subtotal</span><strong>{money(total)}</strong></div>
            <div className="cart-summary-row"><span>Shipping</span><strong className="cart-free">FREE</strong></div>
            <div className="cart-summary-row"><span>Taxes</span><strong>Included</strong></div>
            <div className="cart-summary-total"><span>Total</span><strong>{money(total)}</strong></div>
            <button className="cart-checkout-button" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>
            <p className="cart-secure-note">Secure checkout · Your cart belongs to your account</p>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
