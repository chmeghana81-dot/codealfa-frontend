import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setError("");
      const response = await API.get("products/");
      const data = response.data;

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      setProducts(productList);
    } catch (err) {
      console.error("Products API error:", err);
      setError(
        err.response?.data?.detail ||
        "Unable to load products. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    window.addEventListener("productsUpdated", fetchProducts);

    return () => {
      window.removeEventListener("productsUpdated", fetchProducts);
    };
  }, [fetchProducts]);

  if (loading) return <Loader />;

  if (error) {
    return <p className="products-error">{error}</p>;
  }

  return (
    <section className="products-page">
      <div className="products-heading">
        <p className="products-eyebrow">THE MEGASTORE COLLECTION</p>
        <h1>Explore Our Collection</h1>
        <p>Discover products selected just for you.</p>
      </div>

      <p className="products-count">
        {products.length} Products Available
      </p>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="products-empty">No products available.</p>
        )}
      </div>
    </section>
  );
}

export default Products;
