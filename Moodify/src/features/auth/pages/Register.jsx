import { Link, useNavigate } from "react-router";
import "../style/register.scss";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/login");
  }

  return (
    <div className="register">
      <div className="register__container">
        <h2 className="register__title">Create Account</h2>

        <form onSubmit={handleSubmit} className="register__form">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            placeholder="Username"
          />

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
            Register
          </button>
          <p className="login__footer">
            Already have an account?{" "}
            <Link className="span" to={"/login"}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
