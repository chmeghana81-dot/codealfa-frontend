import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back!</h1>
        <p>Login to your MegaStore account</p>

        <form>
          <input type="email" placeholder="Enter your email" required />
          <input type="password" placeholder="Enter your password" required />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;