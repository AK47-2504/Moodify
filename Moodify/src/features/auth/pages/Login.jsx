import { Link, useNavigate } from "react-router";
import "../style/login.scss";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/main-page");
  }

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="login__form">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="Email"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            placeholder="Password"
          />

          <button className="button" type="submit">
            Login
          </button>
        </form>

        <p className="login__footer">
          Dont have an account?{" "}
          <Link className="span" to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
