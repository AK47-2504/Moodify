import { Link } from "react-router";
import "../style/register.scss";

const Register = () => {
  return (
    <div className="register">
      <div className="register__container">
        <h2 className="register__title">Create Account</h2>

        <form className="register__form">
          <input type="text" name="username" placeholder="Username" />

          <input type="email" name="email" placeholder="Email" />

          <input type="text" name="phone" placeholder="Phone Number" />

          <input type="password" name="password" placeholder="Password" />

          <button className="button" type="submit">Register</button>
          <p className="login__footer">
            Already have an account? <Link className="span" to={"/login"}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
