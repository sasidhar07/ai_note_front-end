import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./login.css";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
    setError("");
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setCredentials({ username: "", password: "", confirmPassword: "" });
    setError("");
    setSuccessMessage("");
  };

  const validateInput = () => {
    const { username, password, confirmPassword } = credentials;
    if (!username || !password) {
      setError("All fields are required");
      return false;
    }
    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      const endpoint = isLogin ? "login" : "register";
      const requestBody = isLogin
        ? { username: credentials.username, password: credentials.password }
        : { username: credentials.username, password: credentials.password };

      const response = await fetch(
        `https://ai-notes-backend-0c9d.onrender.com/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          Cookies.set("jwt_token", data.token, {
            expires: 1,
            sameSite: "None",
            secure: true,
          });
          Cookies.set("username", data.username, {
            expires: 1,
            sameSite: "None",
            secure: true,
          });

          setSuccessMessage("Login successful!");
          setTimeout(() => navigate("/"), 1000);
        } else {
          setSuccessMessage("Account created! Redirecting to login...");
          setTimeout(() => {
            setIsLogin(true);
            setSuccessMessage("");
          }, 2000);
        }
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Network error, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          {!isLogin && (
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={credentials.confirmPassword}
              onChange={handleChange}
            />
          )}
          <button type="submit" disabled={isLoading}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p onClick={toggleForm}>
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
