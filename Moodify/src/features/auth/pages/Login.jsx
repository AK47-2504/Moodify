import { Link } from "react-router";
import "../style/login.scss";


const Login = () => {
  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Welcome Back</h2>

        <form className="login__form">
          <input type="email" name="email" placeholder="Email" />

          <input type="password" name="password" placeholder="Password" />

          <button className="button" type="submit">Login</button>
        </form>

        <p className="login__footer">
          Dont have an account? <Link className="span" to={"/register"}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
