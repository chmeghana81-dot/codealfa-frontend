import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("products/");
        setProducts(response.data);
      } catch (err) {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="products-error">{error}</p>;

  return (
    <section className="products-page">
      <div className="products-heading">
        <h1>Explore Our Collection</h1>
        <p>Discover products selected just for you.</p>
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </section>
  );
}

export default Products;