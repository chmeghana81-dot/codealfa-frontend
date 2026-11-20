import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const formatDate = (value) => {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!localStorage.getItem("access_token")) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get("orders/my-orders/");
        const data = response.data;

        setOrders(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
              ? data.results
              : []
        );
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(
            err.response?.data?.detail ||
            "Unable to load your orders. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusClass = (status) => {
    const value = String(status || "pending").toLowerCase();
    return ["pending", "confirmed", "shipped", "delivered", "cancelled"]
      .includes(value)
      ? value
      : "pending";
  };

  const imageSource = (image) => {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `https://{apiUrl}${image}`;
  };

  if (loading) {
    return (
      <main className="my-orders-page">
        <div className="orders-loading">
          <span className="orders-spinner" />
          <p>Loading your order history...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">
        <section className="orders-empty">
          <div className="orders-empty-icon">!</div>
          <h1>My Orders</h1>
          <p>{error}</p>
          <button
            className="orders-primary-button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="my-orders-page">
      <header className="orders-header">
        <div>
          <span className="orders-eyebrow">MEGASTORE ACCOUNT</span>
          <h1>My Orders</h1>
          <p>Track your purchases and view your order history.</p>
        </div>
        <Link to="/products" className="orders-continue-link">
          Continue Shopping →
        </Link>
      </header>

      <div className="orders-summary-strip">
        <div>
          <span className="orders-summary-number">{orders.length}</span>
          <span>Total Orders</span>
        </div>
        <div>
          <span className="orders-summary-number">
            {orders.filter((o) => statusClass(o.status) === "delivered").length}
          </span>
          <span>Delivered</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <section className="orders-empty">
          <div className="orders-empty-icon">♡</div>
          <h2>No orders yet</h2>
          <p>Your purchases will appear here after you place an order.</p>
          <Link to="/products" className="orders-primary-button">
            Explore Products →
          </Link>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map((order) => {
            const items = order.items || [];
            const isExpanded = expanded === order.id;

            return (
              <article className="order-card" key={order.id}>
                <div className="order-card-top">
                  <div>
                    <span className="order-label">ORDER ID</span>
                    <h2>#{order.id}</h2>
                    <p className="order-date">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <span className={`order-status ${statusClass(order.status)}`}>
                    {String(order.status || "pending").replace(/_/g, " ")}
                  </span>
                </div>

                <div className="order-card-middle">
                  <div className="order-products-preview">
                    {items.slice(0, 3).map((item) => {
                      const image = imageSource(item.product_image);
                      return (
                        <div className="order-product-mini" key={item.id}>
                          {image ? (
                            <img src={image} alt={item.product_name} />
                          ) : (
                            <span>MS</span>
                          )}
                        </div>
                      );
                    })}
                    <div className="order-item-count">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </div>
                  </div>

                  <div className="order-total-block">
                    <span>ORDER TOTAL</span>
                    <strong>{money(order.total_amount)}</strong>
                    <small>
                      {order.payment_method === "cod"
                        ? "Cash on Delivery"
                        : order.payment_method || "Payment"}
                    </small>
                  </div>
                </div>

                <button
                  className="order-details-toggle"
                  onClick={() =>
                    setExpanded(isExpanded ? null : order.id)
                  }
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Hide order details" : "View order details"}
                  <span>{isExpanded ? "−" : "+"}</span>
                </button>

                {isExpanded && (
                  <div className="order-details-panel">
                    <h3>Products ordered</h3>

                    {items.length === 0 ? (
                      <p>Product details are unavailable.</p>
                    ) : (
                      items.map((item) => {
                        const image = imageSource(item.product_image);
                        return (
                          <div className="order-detail-product" key={item.id}>
                            <div className="order-detail-image">
                              {image ? (
                                <img src={image} alt={item.product_name} />
                              ) : (
                                <span>MS</span>
                              )}
                            </div>

                            <div className="order-detail-info">
                              <strong>{item.product_name}</strong>
                              <span>Quantity: {item.quantity}</span>
                              {item.selected_size && (
                                <span>Size: {item.selected_size}</span>
                              )}
                              {item.selected_color && (
                                <span>Colour: {item.selected_color}</span>
                              )}
                            </div>

                            <strong className="order-detail-price">
                              {money(Number(item.price || 0) * Number(item.quantity || 0))}
                            </strong>
                          </div>
                        );
                      })
                    )}

                    <div className="order-delivery-details">
                      <h3>Delivery address</h3>
                      <p><strong>{order.full_name || "Customer"}</strong></p>
                      <p>{order.mobile || ""}</p>
                      <p>
                        {[order.address, order.city, order.state, order.pincode]
                          .filter(Boolean)
                          .join(", ") || "Address information unavailable"}
                      </p>
                    </div>

                    <div className="order-payment-row">
                      <span>Payment method</span>
                      <strong>
                        {order.payment_method === "cod"
                          ? "Cash on Delivery"
                          : order.payment_method || "Not specified"}
                      </strong>
                    </div>

                    <div className="order-payment-row order-grand-total">
                      <span>Total paid / payable</span>
                      <strong>{money(order.total_amount)}</strong>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default MyOrders;
