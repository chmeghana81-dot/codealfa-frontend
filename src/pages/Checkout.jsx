// import { useCallback, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "./Checkout.css";

// function Checkout() {
//   const navigate = useNavigate();

//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(null);

//   const [form, setForm] = useState({
//     full_name: "",
//     mobile: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     payment_method: "cod",
//   });

//   const loadCart = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await API.get("cart/");
//       setCart(response.data);
//     } catch (err) {
//       setError(
//         err.response?.data?.detail ||
//         "Unable to load your shopping cart. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!localStorage.getItem("access_token")) {
//       navigate("/login");
//       return;
//     }
//     loadCart();
//   }, [loadCart, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;
//     if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const money = (value) =>
//     Number(value || 0).toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 2,
//     });

//   const items = cart?.items || [];
//   const subtotal = Number(cart?.total_price || 0);
//   const shipping = 0;
//   const total = subtotal + shipping;

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (items.length === 0) {
//       setError("Your cart is empty. Please add products first.");
//       return;
//     }

//     if (!/^\d{10}$/.test(form.mobile)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     if (!/^\d{6}$/.test(form.pincode)) {
//       setError("Please enter a valid 6-digit PIN code.");
//       return;
//     }

//     try {
//       setPlacing(true);

//       const response = await API.post("orders/place/", form);

//       setSuccess(response.data);
//       setCart({ items: [], total_price: 0 });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       const data = err.response?.data;
//       const message =
//         data?.error ||
//         data?.detail ||
//         (typeof data === "object"
//           ? Object.entries(data)
//               .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
//               .join(" | ")
//           : "") ||
//         "Unable to place your order. Please try again.";

//       setError(message);
//     } finally {
//       setPlacing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="checkout-page">
//         <p className="checkout-loading">Loading your checkout...</p>
//       </main>
//     );
//   }

//   if (success) {
//     return (
//       <main className="checkout-page">
//         <section className="checkout-success">
//           <div className="checkout-success-icon">✓</div>
//           <span className="checkout-eyebrow">MEGASTORE ORDER CONFIRMATION</span>
//           <h1>Thank you for your order!</h1>
//           <p>Your order has been placed successfully.</p>

//           {success.id && (
//             <div className="checkout-order-number">
//               Order ID: <strong>#{success.id}</strong>
//             </div>
//           )}

//           <div className="checkout-success-detail">
//             <span>Payment method</span>
//             <strong>Cash on Delivery</strong>
//           </div>

//           <div className="checkout-success-detail">
//             <span>Order total</span>
//             <strong>{money(success.total_amount)}</strong>
//           </div>

//           <button
//             className="checkout-submit"
//             onClick={() => navigate("/my-orders")}
//           >
//             VIEW MY ORDERS →
//           </button>

//           <Link className="checkout-continue" to="/products">
//             Continue shopping
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <main className="checkout-page">
//         <section className="checkout-empty">
//           <div className="checkout-empty-icon">♡</div>
//           <h1>Your cart is empty</h1>
//           <p>Add some products before proceeding to checkout.</p>
//           <Link to="/products" className="checkout-submit checkout-empty-link">
//             EXPLORE PRODUCTS →
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <main className="checkout-page">
//       <div className="checkout-heading">
//         <span className="checkout-eyebrow">MEGASTORE · SECURE CHECKOUT</span>
//         <h1>Complete Your Order</h1>
//         <p>Almost there! Enter your delivery details below.</p>
//       </div>

//       <div className="checkout-steps">
//         <span className="active">01 <small>Address</small></span>
//         <i />
//         <span className="active">02 <small>Order review</small></span>
//         <i />
//         <span className="active">03 <small>Payment</small></span>
//       </div>

//       {error && (
//         <div className="checkout-error" role="alert">
//           <strong>Unable to continue</strong>
//           <p>{error}</p>
//         </div>
//       )}

//       <form onSubmit={handlePlaceOrder}>
//         <div className="checkout-layout">
//           <section className="checkout-form-section">
//             <div className="checkout-card">
//               <div className="checkout-section-title">
//                 <span>01</span>
//                 <div>
//                   <h2>Delivery Information</h2>
//                   <p>Where should we deliver your order?</p>
//                 </div>
//               </div>

//               <div className="checkout-fields">
//                 <div className="checkout-field full">
//                   <label htmlFor="full_name">FULL NAME *</label>
//                   <input
//                     id="full_name"
//                     name="full_name"
//                     value={form.full_name}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                     autoComplete="name"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field full">
//                   <label htmlFor="mobile">MOBILE NUMBER *</label>
//                   <input
//                     id="mobile"
//                     name="mobile"
//                     type="tel"
//                     value={form.mobile}
//                     onChange={handleChange}
//                     placeholder="10-digit mobile number"
//                     maxLength={10}
//                     inputMode="numeric"
//                     autoComplete="tel"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field full">
//                   <label htmlFor="address">COMPLETE ADDRESS *</label>
//                   <textarea
//                     id="address"
//                     name="address"
//                     value={form.address}
//                     onChange={handleChange}
//                     placeholder="House number, street, area, landmark..."
//                     rows={4}
//                     autoComplete="street-address"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field">
//                   <label htmlFor="city">CITY *</label>
//                   <input
//                     id="city"
//                     name="city"
//                     value={form.city}
//                     onChange={handleChange}
//                     placeholder="Your city"
//                     autoComplete="address-level2"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field">
//                   <label htmlFor="state">STATE *</label>
//                   <input
//                     id="state"
//                     name="state"
//                     value={form.state}
//                     onChange={handleChange}
//                     placeholder="Your state"
//                     autoComplete="address-level1"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field">
//                   <label htmlFor="pincode">PIN CODE *</label>
//                   <input
//                     id="pincode"
//                     name="pincode"
//                     value={form.pincode}
//                     onChange={handleChange}
//                     placeholder="6-digit PIN code"
//                     maxLength={6}
//                     inputMode="numeric"
//                     autoComplete="postal-code"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="checkout-card">
//               <div className="checkout-section-title">
//                 <span>02</span>
//                 <div>
//                   <h2>Payment Method</h2>
//                   <p>Choose how you want to pay.</p>
//                 </div>
//               </div>

//               <label className="checkout-payment-option">
//                 <input
//                   type="radio"
//                   name="payment_method"
//                   value="cod"
//                   checked={form.payment_method === "cod"}
//                   onChange={handleChange}
//                 />
//                 <span className="checkout-payment-icon">₹</span>
//                 <span className="checkout-payment-text">
//                   <strong>Cash on Delivery</strong>
//                   <small>Pay when your order arrives.</small>
//                 </span>
//                 <span className="checkout-payment-check">✓</span>
//               </label>

//               <p className="checkout-payment-note">
//                 Online payment is not enabled yet. Your order will be placed
//                 using Cash on Delivery.
//               </p>
//             </div>
//           </section>

//           <aside className="checkout-summary">
//             <div className="checkout-summary-heading">
//               <h2>Your Order</h2>
//               <span>{items.length} item(s)</span>
//             </div>

//             <div className="checkout-products">
//               {items.map((item) => {
//                 const image = item.product_image;
//                 const imageUrl = image
//                   ? image.startsWith("http")
//                     ? image
//                     : `https://{127.0.0.1:8000}${image}`
//                   : "";

//                 return (
//                   <article className="checkout-product" key={item.id}>
//                     <div className="checkout-product-image">
//                       {imageUrl ? (
//                         <img src={imageUrl} alt={item.product_name} />
//                       ) : (
//                         <span>MEGA</span>
//                       )}
//                       <small>{item.quantity}</small>
//                     </div>

//                     <div className="checkout-product-info">
//                       <h3>{item.product_name}</h3>
//                       {item.selected_size && <p>Size: {item.selected_size}</p>}
//                       {item.selected_color && <p>Colour: {item.selected_color}</p>}
//                       <span>{money(item.product_price)} each</span>
//                     </div>

//                     <strong>{money(item.subtotal)}</strong>
//                   </article>
//                 );
//               })}
//             </div>

//             <div className="checkout-price-row">
//               <span>Subtotal</span>
//               <strong>{money(subtotal)}</strong>
//             </div>

//             <div className="checkout-price-row">
//               <span>Delivery</span>
//               <strong className="checkout-free">FREE</strong>
//             </div>

//             <div className="checkout-price-row">
//               <span>Taxes</span>
//               <strong>Included</strong>
//             </div>

//             <div className="checkout-grand-total">
//               <span>Grand Total</span>
//               <strong>{money(total)}</strong>
//             </div>

//             <button
//               type="submit"
//               className="checkout-submit"
//               disabled={placing}
//             >
//               {placing ? "PLACING YOUR ORDER..." : "PLACE ORDER · COD →"}
//             </button>

//             <p className="checkout-secure">
//               <span>◇</span> Secure checkout · Your information is protected
//             </p>

//             <Link to="/cart" className="checkout-back">
//               ← Return to shopping cart
//             </Link>
//           </aside>
//         </div>
//       </form>
//     </main>
//   );
// }

// export default Checkout;


// import { useCallback, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "./Checkout.css";

// // Load Razorpay Checkout SDK
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);

//     document.body.appendChild(script);
//   });
// };

// function Checkout() {
//   const navigate = useNavigate();

//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(null);

//   const [form, setForm] = useState({
//     full_name: "",
//     mobile: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     payment_method: "cod",
//   });

//   // Load cart
//   const loadCart = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await API.get("cart/");
//       setCart(response.data);
//     } catch (err) {
//       setError(
//         err.response?.data?.detail ||
//           "Unable to load your shopping cart. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!localStorage.getItem("access_token")) {
//       navigate("/login");
//       return;
//     }

//     loadCart();
//   }, [loadCart, navigate]);

//   // Form changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;
//     if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // Currency formatting
//   const money = (value) =>
//     Number(value || 0).toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 2,
//     });

//   const items = cart?.items || [];
//   const subtotal = Number(cart?.total_price || 0);
//   const shipping = 0;
//   const total = subtotal + shipping;

//   // Display API errors
//   const getErrorMessage = (err) => {
//     const data = err.response?.data;

//     if (typeof data === "string") return data;
//     if (data?.error) return data.error;
//     if (data?.detail) return data.detail;

//     if (data && typeof data === "object") {
//       return Object.entries(data)
//         .map(([key, value]) => {
//           return `${key}: ${
//             Array.isArray(value) ? value.join(", ") : value
//           }`;
//         })
//         .join(" | ");
//     }

//     return err.message || "Something went wrong. Please try again.";
//   };

//   // Validate delivery details
//   const validateForm = () => {
//     if (!form.full_name.trim()) {
//       setError("Please enter your full name.");
//       return false;
//     }

//     if (!/^\d{10}$/.test(form.mobile)) {
//       setError("Please enter a valid 10-digit mobile number.");
//       return false;
//     }

//     if (!form.address.trim()) {
//       setError("Please enter your delivery address.");
//       return false;
//     }

//     if (!form.city.trim() || !form.state.trim()) {
//       setError("Please enter your city and state.");
//       return false;
//     }

//     if (!/^\d{6}$/.test(form.pincode)) {
//       setError("Please enter a valid 6-digit PIN code.");
//       return false;
//     }

//     return true;
//   };

//   // COD order
//   const placeCODOrder = async () => {
//     const response = await API.post("orders/place/", {
//       ...form,
//       payment_method: "cod",
//     });

//     setSuccess({
//       ...response.data,
//       payment_method: "cod",
//     });

//     setCart({
//       items: [],
//       total_price: 0,
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // Verify Razorpay payment on Django backend
//   const verifyRazorpayPayment = async (paymentResponse) => {
//     try {
//       setPlacing(true);
//       setError("");

//       const response = await API.post(
//         "orders/verify-razorpay-payment/",
//         {
//           ...form,
//           payment_method: "razorpay",
//           razorpay_order_id: paymentResponse.razorpay_order_id,
//           razorpay_payment_id: paymentResponse.razorpay_payment_id,
//           razorpay_signature: paymentResponse.razorpay_signature,
//         }
//       );

//       setSuccess({
//         ...response.data,
//         payment_method: "razorpay",
//         payment_id: paymentResponse.razorpay_payment_id,
//       });

//       setCart({
//         items: [],
//         total_price: 0,
//       });

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (err) {
//       setError(
//         getErrorMessage(err) ||
//           "Payment verification failed. Please contact support."
//       );
//     } finally {
//       setPlacing(false);
//     }
//   };

//   // Start Razorpay payment
//   const startRazorpayPayment = async () => {
//     const scriptLoaded = await loadRazorpayScript();

//     if (!scriptLoaded) {
//       throw new Error(
//         "Unable to load Razorpay. Please check your internet connection."
//       );
//     }

//     // Request a payment order from Django
//     const response = await API.post(
//       "orders/create-razorpay-order/",
//       {
//         ...form,
//         payment_method: "razorpay",
//       }
//     );

//     const razorpayData = response.data;

//     const keyId =
//       razorpayData.key_id || razorpayData.razorpay_key_id;

//     const razorpayOrderId =
//       razorpayData.order_id || razorpayData.razorpay_order_id;

//     if (!keyId || !razorpayOrderId || !razorpayData.amount) {
//       throw new Error(
//         "Invalid Razorpay order response from backend."
//       );
//     }

//     const options = {
//       key: keyId,
//       amount: Number(razorpayData.amount),
//       currency: razorpayData.currency || "INR",
//       name: "MegaStore",
//       description: "Secure Ecommerce Payment",
//       order_id: razorpayOrderId,

//       prefill: {
//         name: form.full_name,
//         contact: form.mobile,
//       },

//       theme: {
//         color: "#2563eb",
//       },

//       handler: async (paymentResponse) => {
//         await verifyRazorpayPayment(paymentResponse);
//       },

//       modal: {
//         ondismiss: () => {
//           setError(
//             "Payment cancelled. Your order has not been confirmed."
//           );
//         },
//       },
//     };

//     const razorpay = new window.Razorpay(options);

//     razorpay.on("payment.failed", (paymentResponse) => {
//       setError(
//         paymentResponse.error?.description ||
//           "Payment failed. Please try again."
//       );
//     });

//     razorpay.open();
//   };

//   // Main checkout handler
//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (items.length === 0) {
//       setError("Your cart is empty. Please add products first.");
//       return;
//     }

//     if (!validateForm()) return;

//     try {
//       setPlacing(true);

//       if (form.payment_method === "cod") {
//         await placeCODOrder();
//       } else if (form.payment_method === "razorpay") {
//         await startRazorpayPayment();
//       } else {
//         setError("Please select a valid payment method.");
//       }
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPlacing(false);
//     }
//   };

//   // Loading screen
//   if (loading) {
//     return (
//       <main className="checkout-page">
//         <p className="checkout-loading">
//           Loading your checkout...
//         </p>
//       </main>
//     );
//   }

//   // Success screen
//   if (success) {
//     return (
//       <main className="checkout-page">
//         <section className="checkout-success">
//           <div className="checkout-success-icon">✓</div>

//           <span className="checkout-eyebrow">
//             MEGASTORE ORDER CONFIRMATION
//           </span>

//           <h1>Thank you for your order!</h1>

//           <p>Your order has been placed successfully.</p>

//           {success.id && (
//             <div className="checkout-order-number">
//               Order ID: <strong>#{success.id}</strong>
//             </div>
//           )}

//           <div className="checkout-success-detail">
//             <span>Payment method</span>
//             <strong>
//               {success.payment_method === "razorpay"
//                 ? "Razorpay (Online Payment)"
//                 : "Cash on Delivery"}
//             </strong>
//           </div>

//           {success.payment_id && (
//             <div className="checkout-success-detail">
//               <span>Payment ID</span>
//               <strong>{success.payment_id}</strong>
//             </div>
//           )}

//           <div className="checkout-success-detail">
//             <span>Order total</span>
//             <strong>{money(success.total_amount)}</strong>
//           </div>

//           <button
//             className="checkout-submit"
//             onClick={() => navigate("/my-orders")}
//           >
//             VIEW MY ORDERS →
//           </button>

//           <Link className="checkout-continue" to="/products">
//             Continue shopping
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   // Empty cart
//   if (items.length === 0) {
//     return (
//       <main className="checkout-page">
//         <section className="checkout-empty">
//           <div className="checkout-empty-icon">♡</div>

//           <h1>Your cart is empty</h1>

//           <p>
//             Add some products before proceeding to checkout.
//           </p>

//           <Link
//             to="/products"
//             className="checkout-submit checkout-empty-link"
//           >
//             EXPLORE PRODUCTS →
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <main className="checkout-page">
//       <div className="checkout-heading">
//         <span className="checkout-eyebrow">
//           MEGASTORE · SECURE CHECKOUT
//         </span>

//         <h1>Complete Your Order</h1>

//         <p>
//           Almost there! Enter your delivery details below.
//         </p>
//       </div>

//       <div className="checkout-steps">
//         <span className="active">
//           01 <small>Address</small>
//         </span>

//         <i />

//         <span className="active">
//           02 <small>Order review</small>
//         </span>

//         <i />

//         <span className="active">
//           03 <small>Payment</small>
//         </span>
//       </div>

//       {error && (
//         <div className="checkout-error" role="alert">
//           <strong>Unable to continue</strong>
//           <p>{error}</p>
//         </div>
//       )}

//       <form onSubmit={handlePlaceOrder}>
//         <div className="checkout-layout">
//           <section className="checkout-form-section">

//             {/* Delivery Information */}
//             <div className="checkout-card">
//               <div className="checkout-section-title">
//                 <span>01</span>

//                 <div>
//                   <h2>Delivery Information</h2>
//                   <p>
//                     Where should we deliver your order?
//                   </p>
//                 </div>
//               </div>

//               <div className="checkout-fields">
//                 <div className="checkout-field full">
//                   <label htmlFor="full_name">
//                     FULL NAME *
//                   </label>

//                   <input
//                     id="full_name"
//                     name="full_name"
//                     value={form.full_name}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                     autoComplete="name"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field full">
//                   <label htmlFor="mobile">
//                     MOBILE NUMBER *
//                   </label>

//                   <input
//                     id="mobile"
//                     name="mobile"
//                     type="tel"
//                     value={form.mobile}
//                     onChange={handleChange}
//                     placeholder="10-digit mobile number"
//                     maxLength={10}
//                     inputMode="numeric"
//                     autoComplete="tel"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field full">
//                   <label htmlFor="address">
//                     COMPLETE ADDRESS *
//                   </label>

//                   <textarea
//                     id="address"
//                     name="address"
//                     value={form.address}
//                     onChange={handleChange}
//                     placeholder="House number, street, area, landmark..."
//                     rows={4}
//                     autoComplete="street-address"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field">
//                   <label htmlFor="city">CITY *</label>

//                   <input
//                     id="city"
//                     name="city"
//                     value={form.city}
//                     onChange={handleChange}
//                     placeholder="Your city"
//                     autoComplete="address-level2"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field">
//                   <label htmlFor="state">STATE *</label>

//                   <input
//                     id="state"
//                     name="state"
//                     value={form.state}
//                     onChange={handleChange}
//                     placeholder="Your state"
//                     autoComplete="address-level1"
//                     required
//                   />
//                 </div>

//                 <div className="checkout-field">
//                   <label htmlFor="pincode">
//                     PIN CODE *
//                   </label>

//                   <input
//                     id="pincode"
//                     name="pincode"
//                     value={form.pincode}
//                     onChange={handleChange}
//                     placeholder="6-digit PIN code"
//                     maxLength={6}
//                     inputMode="numeric"
//                     autoComplete="postal-code"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="checkout-card">
//               <div className="checkout-section-title">
//                 <span>02</span>

//                 <div>
//                   <h2>Payment Method</h2>
//                   <p>Choose how you want to pay.</p>
//                 </div>
//               </div>

//               {/* Cash on Delivery */}
//               <label className="checkout-payment-option">
//                 <input
//                   type="radio"
//                   name="payment_method"
//                   value="cod"
//                   checked={form.payment_method === "cod"}
//                   onChange={handleChange}
//                 />

//                 <span className="checkout-payment-icon">
//                   ₹
//                 </span>

//                 <span className="checkout-payment-text">
//                   <strong>Cash on Delivery</strong>
//                   <small>
//                     Pay when your order arrives.
//                   </small>
//                 </span>

//                 <span className="checkout-payment-check">
//                   ✓
//                 </span>
//               </label>

//               {/* Razorpay */}
//               <label className="checkout-payment-option">
//                 <input
//                   type="radio"
//                   name="payment_method"
//                   value="razorpay"
//                   checked={form.payment_method === "razorpay"}
//                   onChange={handleChange}
//                 />

//                 <span className="checkout-payment-icon">
//                   ₹
//                 </span>

//                 <span className="checkout-payment-text">
//                   <strong>Pay Online with Razorpay</strong>
//                   <small>
//                     UPI, Credit Card, Debit Card & Net Banking
//                   </small>
//                 </span>

//                 <span className="checkout-payment-check">
//                   ✓
//                 </span>
//               </label>

//               <p className="checkout-payment-note">
//                 {form.payment_method === "razorpay"
//                   ? "Secure online payment powered by Razorpay."
//                   : "Pay cash when your order is delivered."}
//               </p>
//             </div>
//           </section>

//           {/* Order Summary */}
//           <aside className="checkout-summary">
//             <div className="checkout-summary-heading">
//               <h2>Your Order</h2>
//               <span>{items.length} item(s)</span>
//             </div>

//             <div className="checkout-products">
//               {items.map((item) => {
//                 const image = item.product_image;

//                 const imageUrl = image
//                   ? image.startsWith("http")
//                     ? image
//                     : `https://{127.0.0.1:8000}${image}`
//                   : "";

//                 return (
//                   <article
//                     className="checkout-product"
//                     key={item.id}
//                   >
//                     <div className="checkout-product-image">
//                       {imageUrl ? (
//                         <img
//                           src={imageUrl}
//                           alt={item.product_name}
//                         />
//                       ) : (
//                         <span>MEGA</span>
//                       )}

//                       <small>{item.quantity}</small>
//                     </div>

//                     <div className="checkout-product-info">
//                       <h3>{item.product_name}</h3>

//                       {item.selected_size && (
//                         <p>Size: {item.selected_size}</p>
//                       )}

//                       {item.selected_color && (
//                         <p>Colour: {item.selected_color}</p>
//                       )}

//                       <span>
//                         {money(item.product_price)} each
//                       </span>
//                     </div>

//                     <strong>{money(item.subtotal)}</strong>
//                   </article>
//                 );
//               })}
//             </div>

//             <div className="checkout-price-row">
//               <span>Subtotal</span>
//               <strong>{money(subtotal)}</strong>
//             </div>

//             <div className="checkout-price-row">
//               <span>Delivery</span>
//               <strong className="checkout-free">
//                 FREE
//               </strong>
//             </div>

//             <div className="checkout-price-row">
//               <span>Taxes</span>
//               <strong>Included</strong>
//             </div>

//             <div className="checkout-grand-total">
//               <span>Grand Total</span>
//               <strong>{money(total)}</strong>
//             </div>

//             <button
//               type="submit"
//               className="checkout-submit"
//               disabled={placing}
//             >
//               {placing
//                 ? "PROCESSING..."
//                 : form.payment_method === "razorpay"
//                   ? "PAY NOW · RAZORPAY →"
//                   : "PLACE ORDER · COD →"}
//             </button>

//             <p className="checkout-secure">
//               <span>◇</span> Secure checkout · Your information
//               is protected
//             </p>

//             <Link to="/cart" className="checkout-back">
//               ← Return to shopping cart
//             </Link>
//           </aside>
//         </div>
//       </form>
//     </main>
//   );
// }

// export default Checkout;

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Checkout.css";

// Load Razorpay Checkout SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment_method: "cod",
  });

  // Load cart
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("cart/");
      setCart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load your shopping cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }

    loadCart();
  }, [loadCart, navigate]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) {
      return;
    }

    if (name === "pincode" && !/^\d{0,6}$/.test(value)) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Currency formatting
  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const items = cart?.items || [];
  const subtotal = Number(cart?.total_price || 0);
  const shipping = 0;
  const total = subtotal + shipping;

  // Display API errors
  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.error) {
      return data.error;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data && typeof data === "object") {
      return Object.entries(data)
        .map(([key, value]) => {
          return `${key}: ${
            Array.isArray(value) ? value.join(", ") : value
          }`;
        })
        .join(" | ");
    }

    return err.message || "Something went wrong. Please try again.";
  };

  // Validate delivery details
  const validateForm = () => {
    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!form.address.trim()) {
      setError("Please enter your delivery address.");
      return false;
    }

    if (!form.city.trim() || !form.state.trim()) {
      setError("Please enter your city and state.");
      return false;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return false;
    }

    return true;
  };

  // Handle successful order
  const handleOrderSuccess = (orderData) => {
    setSuccess(orderData);

    setCart({
      items: [],
      total_price: 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Place COD order
  const placeCODOrder = async () => {
    const response = await API.post("orders/place/", {
      ...form,
      payment_method: "cod",
    });

    handleOrderSuccess({
      ...response.data,
      payment_method: "cod",
    });
  };

  // Verify Razorpay payment through Django
  const verifyRazorpayPayment = async (paymentResponse) => {
    try {
      setPlacing(true);
      setError("");

      const response = await API.post(
        "payments/verify-payment/",
        {
          ...form,
          payment_method: "razorpay",
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }
      );

      handleOrderSuccess({
        ...response.data,
        payment_method: "razorpay",
        payment_id: paymentResponse.razorpay_payment_id,
      });
    } catch (err) {
      setError(
        getErrorMessage(err) ||
          "Payment verification failed. Please contact support."
      );
    } finally {
      setPlacing(false);
    }
  };

  // Start Razorpay payment
  const startRazorpayPayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error(
        "Unable to load Razorpay. Please check your internet connection."
      );
    }

    // Create Razorpay order through Django
    const response = await API.post(
      "payments/create-order/",
      {
        ...form,
        payment_method: "razorpay",
      }
    );

    const razorpayData = response.data;

    const keyId =
      razorpayData.key_id || razorpayData.razorpay_key_id;

    const razorpayOrderId =
      razorpayData.order_id || razorpayData.razorpay_order_id;

    if (!keyId || !razorpayOrderId || !razorpayData.amount) {
      throw new Error(
        "Invalid Razorpay order response from backend."
      );
    }

    const options = {
      key: keyId,
      amount: Number(razorpayData.amount),
      currency: razorpayData.currency || "INR",
      name: "MegaStore",
      description: "Secure Ecommerce Payment",
      order_id: razorpayOrderId,

      prefill: {
        name: form.full_name,
        contact: form.mobile,
      },

      theme: {
        color: "#2563eb",
      },

      handler: async (paymentResponse) => {
        await verifyRazorpayPayment(paymentResponse);
      },

      modal: {
        ondismiss: () => {
          setPlacing(false);
          setError(
            "Payment cancelled. Your order has not been confirmed."
          );
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (paymentResponse) => {
      setPlacing(false);

      setError(
        paymentResponse.error?.description ||
          "Payment failed. Please try again."
      );
    });

    razorpay.open();
  };

  // Main checkout handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Please add products first.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setPlacing(true);

      if (form.payment_method === "cod") {
        await placeCODOrder();
      } else if (form.payment_method === "razorpay") {
        await startRazorpayPayment();
      } else {
        setError("Please select a valid payment method.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <main className="checkout-page">
        <p className="checkout-loading">
          Loading your checkout...
        </p>
      </main>
    );
  }

  // Success screen
  if (success) {
    return (
      <main className="checkout-page">
        <section className="checkout-success">
          <div className="checkout-success-icon">✓</div>

          <span className="checkout-eyebrow">
            MEGASTORE ORDER CONFIRMATION
          </span>

          <h1>Thank you for your order!</h1>

          <p>Your order has been placed successfully.</p>

          {success.id && (
            <div className="checkout-order-number">
              Order ID: <strong>#{success.id}</strong>
            </div>
          )}

          <div className="checkout-success-detail">
            <span>Payment method</span>
            <strong>
              {success.payment_method === "razorpay"
                ? "Razorpay (Online Payment)"
                : "Cash on Delivery"}
            </strong>
          </div>

          {success.payment_id && (
            <div className="checkout-success-detail">
              <span>Payment ID</span>
              <strong>{success.payment_id}</strong>
            </div>
          )}

          <div className="checkout-success-detail">
            <span>Order total</span>
            <strong>
              {money(success.total_amount ?? success.total_price)}
            </strong>
          </div>

          <button
            className="checkout-submit"
            onClick={() => navigate("/my-orders")}
          >
            VIEW MY ORDERS →
          </button>

          <Link className="checkout-continue" to="/products">
            Continue shopping
          </Link>
        </section>
      </main>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <div className="checkout-empty-icon">♡</div>

          <h1>Your cart is empty</h1>

          <p>
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="checkout-submit checkout-empty-link"
          >
            EXPLORE PRODUCTS →
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <span className="checkout-eyebrow">
          MEGASTORE · SECURE CHECKOUT
        </span>

        <h1>Complete Your Order</h1>

        <p>
          Almost there! Enter your delivery details below.
        </p>
      </div>

      <div className="checkout-steps">
        <span className="active">
          01 <small>Address</small>
        </span>

        <i />

        <span className="active">
          02 <small>Order review</small>
        </span>

        <i />

        <span className="active">
          03 <small>Payment</small>
        </span>
      </div>

      {error && (
        <div className="checkout-error" role="alert">
          <strong>Unable to continue</strong>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="checkout-layout">
          <section className="checkout-form-section">

            {/* Delivery Information */}
            <div className="checkout-card">
              <div className="checkout-section-title">
                <span>01</span>

                <div>
                  <h2>Delivery Information</h2>
                  <p>
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="checkout-fields">
                <div className="checkout-field full">
                  <label htmlFor="full_name">
                    FULL NAME *
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="checkout-field full">
                  <label htmlFor="mobile">
                    MOBILE NUMBER *
                  </label>

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="checkout-field full">
                  <label htmlFor="address">
                    COMPLETE ADDRESS *
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House number, street, area, landmark..."
                    rows={4}
                    autoComplete="street-address"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">CITY *</label>

                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">STATE *</label>

                  <input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Your state"
                    autoComplete="address-level1"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="pincode">
                    PIN CODE *
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-card">
              <div className="checkout-section-title">
                <span>02</span>

                <div>
                  <h2>Payment Method</h2>
                  <p>Choose how you want to pay.</p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={form.payment_method === "cod"}
                  onChange={handleChange}
                />

                <span className="checkout-payment-icon">
                  ₹
                </span>

                <span className="checkout-payment-text">
                  <strong>Cash on Delivery</strong>
                  <small>
                    Pay when your order arrives.
                  </small>
                </span>

                <span className="checkout-payment-check">
                  ✓
                </span>
              </label>

              {/* Razorpay */}
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value="razorpay"
                  checked={form.payment_method === "razorpay"}
                  onChange={handleChange}
                />

                <span className="checkout-payment-icon">
                  ₹
                </span>

                <span className="checkout-payment-text">
                  <strong>Pay Online with Razorpay</strong>
                  <small>
                    UPI, Credit Card, Debit Card & Net Banking
                  </small>
                </span>

                <span className="checkout-payment-check">
                  ✓
                </span>
              </label>

              <p className="checkout-payment-note">
                {form.payment_method === "razorpay"
                  ? "Secure online payment powered by Razorpay."
                  : "Pay cash when your order is delivered."}
              </p>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <div className="checkout-summary-heading">
              <h2>Your Order</h2>
              <span>{items.length} item(s)</span>
            </div>

            <div className="checkout-products">
              {items.map((item) => {
                const image = item.product_image;

                const imageUrl = image
                  ? image.startsWith("http")
                    ? image
                    : `https://{127.0.0.1:8000}${image}`
                  : "";

                return (
                  <article
                    className="checkout-product"
                    key={item.id}
                  >
                    <div className="checkout-product-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product_name}
                        />
                      ) : (
                        <span>MEGA</span>
                      )}

                      <small>{item.quantity}</small>
                    </div>

                    <div className="checkout-product-info">
                      <h3>{item.product_name}</h3>

                      {item.selected_size && (
                        <p>Size: {item.selected_size}</p>
                      )}

                      {item.selected_color && (
                        <p>Colour: {item.selected_color}</p>
                      )}

                      <span>
                        {money(item.product_price)} each
                      </span>
                    </div>

                    <strong>{money(item.subtotal)}</strong>
                  </article>
                );
              })}
            </div>

            <div className="checkout-price-row">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>

            <div className="checkout-price-row">
              <span>Delivery</span>
              <strong className="checkout-free">
                FREE
              </strong>
            </div>

            <div className="checkout-price-row">
              <span>Taxes</span>
              <strong>Included</strong>
            </div>

            <div className="checkout-grand-total">
              <span>Grand Total</span>
              <strong>{money(total)}</strong>
            </div>

            <button
              type="submit"
              className="checkout-submit"
              disabled={placing}
            >
              {placing
                ? "PROCESSING..."
                : form.payment_method === "razorpay"
                  ? "PAY NOW · RAZORPAY →"
                  : "PLACE ORDER · COD →"}
            </button>

            <p className="checkout-secure">
              <span>◇</span> Secure checkout · Your information
              is protected
            </p>

            <Link to="/cart" className="checkout-back">
              ← Return to shopping cart
            </Link>
          </aside>
        </div>
      </form>
    </main>
  );
}

export default Checkout;
