import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const apiUrl = import.meta.env.VITE_API_URL

const API_BASE = `https://${apiUrl}/api`;

const getList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN") : "-";

function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectionErrors, setSectionErrors] = useState({});
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const token = localStorage.getItem("access_token");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.detail || data.error || `Request failed (${response.status})`
      );
    }

    return data;
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setSectionErrors({});

    const endpoints = [
      ["products", "/"],
      ["categories", "/categories/"],
      ["carts", "/cart/admin/"],
      ["users", "/auth/admin/users/"],
      ["orders", "/orders/admin/"],
      ["payments", "/payments/admin/"],
    ];

    const results = await Promise.all(
      endpoints.map(async ([key, url]) => {
        try {
          const data = await request(url);
          return { key, data, error: "" };
        } catch (err) {
          return { key, data: [], error: err.message };
        }
      })
    );

    const errors = {};

    results.forEach(({ key, data, error }) => {
      if (error) errors[key] = error;

      const list = getList(data);

      switch (key) {
        case "products":
          setProducts(list);
          break;
        case "categories":
          setCategories(list);
          break;
        case "carts":
          setCarts(list);
          break;
        case "users":
          setUsers(list);
          break;
        case "orders":
          setOrders(list);
          break;
        case "payments":
          setPayments(list);
          break;
        default:
          break;
      }
    });

    setSectionErrors(errors);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const updatedOrder = await request(
        `/orders/admin/${orderId}/status/`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );

      alert("Order status updated successfully.");
    } catch (err) {
      alert(`Unable to update order: ${err.message}`);
      loadDashboardData();
    } finally {
      setUpdatingOrder(null);
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const totalInventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 12
  );

  const filteredProducts = products.filter((product) =>
    (product.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const menuItems = [
    "Dashboard",
    "Products",
    "Categories",
    "Cart",
    "Users",
    "Orders",
    "Payments",
  ];

  const renderProducts = (items) => (
    <div className="table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : "No Image"}
                </td>
                <td>{product.name}</td>
                <td>{product.category_name}</td>
                <td>₹{money(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`status ${
                    product.stock > 0 ? "delivered" : "cancelled"
                  }`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderError = (key) =>
    sectionErrors[key] ? (
      <p style={{ color: "#c0392b", padding: "12px" }}>
        {sectionErrors[key]}
      </p>
    ) : null;

  if (loading) {
    return <div className="admin-main">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">
          Mega<span>Store</span>
        </h2>

        <p className="admin-label">ADMIN PANEL</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={`admin-nav-item ${
                activePage === item ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item);
                setSearch("");
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p>MEGASTORE ADMIN</p>
          <small>Management Console</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{activePage} Overview</h1>
            <p>Manage your MegaStore application.</p>
          </div>

          <div className="admin-profile">
            <span>Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <button className="gold-btn" onClick={loadDashboardData}>
            Refresh Data
          </button>
        </div>

        {activePage === "Dashboard" && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <span className="stat-icon">□</span>
                <p>Total Products</p>
                <h2>{totalProducts}</h2>
                <small>From Django database</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon">▤</span>
                <p>Total Categories</p>
                <h2>{categories.length}</h2>
                <small>Available categories</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon">▥</span>
                <p>Total Stock</p>
                <h2>{totalStock}</h2>
                <small>Inventory units</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon">₹</span>
                <p>Inventory Value</p>
                <h2>₹{money(totalInventoryValue)}</h2>
                <small>Price × stock</small>
              </div>

              <div className="stat-card">
                <p>Total Users</p>
                <h2>{users.length}</h2>
              </div>

              <div className="stat-card">
                <p>Total Orders</p>
                <h2>{orders.length}</h2>
              </div>

              <div className="stat-card">
                <p>Total Carts</p>
                <h2>{carts.length}</h2>
              </div>

              <div className="stat-card">
                <p>Total Payments</p>
                <h2>{payments.length}</h2>
              </div>
            </div>

            {renderError("products")}
            {renderError("categories")}

            <div className="admin-panel">
              <div className="panel-heading">
                <h3>Recent Products</h3>
                <button onClick={() => setActivePage("Products")}>
                  View All
                </button>
              </div>
              {renderProducts(products.slice(0, 5))}
            </div>

            <div className="admin-panel">
              <div className="panel-heading">
                <h3>Low Stock Products</h3>
              </div>
              {renderProducts(lowStockProducts)}
            </div>
          </>
        )}

        {activePage === "Products" && (
          <>
            {renderError("products")}
            <div className="admin-toolbar">
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-panel">
              <div className="panel-heading">
                <h3>All Products ({filteredProducts.length})</h3>
              </div>
              {renderProducts(filteredProducts)}
            </div>
          </>
        )}

        {activePage === "Categories" && (
          <div className="admin-panel">
            {renderError("categories")}
            <div className="panel-heading">
              <h3>All Categories ({categories.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>{category.description || "No description"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "Cart" && (
          <div className="admin-panel">
            {renderError("carts")}
            <div className="panel-heading">
              <h3>All Customer Carts ({carts.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cart ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((cart) => (
                    <tr key={cart.id}>
                      <td>#{cart.id}</td>
                      <td>{cart.username || `User ${cart.user}`}</td>
                      <td>{cart.items?.length || 0}</td>
                      <td>
                        {cart.items?.map((item) => (
                          <div key={item.id}>
                            {item.product_name} × {item.quantity}
                            {item.selected_size ? ` (${item.selected_size})` : ""}
                          </div>
                        ))}
                      </td>
                      <td>₹{money(cart.total_price)}</td>
                      <td>{formatDate(cart.updated_at)}</td>
                    </tr>
                  ))}
                  {carts.length === 0 && (
                    <tr><td colSpan="6">No carts found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "Users" && (
          <div className="admin-panel">
            {renderError("users")}
            <div className="panel-heading">
              <h3>Registered Users ({users.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Role</th>
                    <th>Account</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email || "-"}</td>
                      <td>{formatDate(user.date_joined)}</td>
                      <td>{user.is_superuser ? "Super Admin" : user.is_staff ? "Staff" : "Customer"}</td>
                      <td>{user.is_active ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="6">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "Orders" && (
          <div className="admin-panel">
            {renderError("orders")}
            <div className="panel-heading">
              <h3>All Orders ({orders.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        {order.username}
                        <div>{order.full_name}</div>
                      </td>
                      <td>
                        {order.items?.map((item) => (
                          <div key={item.id}>
                            {item.product_name} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td>₹{money(order.total_amount)}</td>
                      <td>{order.payment_method}</td>
                      <td>{order.payment_status}</td>
                      <td>
                        <select
                          value={order.status}
                          disabled={updatingOrder === order.id}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                        >
                          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                            <option key={status} value={status}>
                              {status.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="8">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "Payments" && (
          <div className="admin-panel">
            {renderError("payments")}
            <div className="panel-heading">
              <h3>Payment Transactions ({payments.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Customer</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Payment Status</th>
                    <th>Razorpay Payment ID</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>#{payment.id}</td>
                      <td>
                        {payment.username}
                        <div>{payment.email}</div>
                      </td>
                      <td>{payment.order_id ? `#${payment.order_id}` : "-"}</td>
                      <td>₹{money(Number(payment.amount || 0) / 100)}</td>
                      <td>{payment.currency}</td>
                      <td>{payment.status}</td>
                      <td>{payment.razorpay_payment_id || "-"}</td>
                      <td>{formatDate(payment.created_at)}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan="8">No payment records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
