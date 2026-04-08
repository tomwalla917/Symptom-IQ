import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphql/queries";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

interface RegisterData {
  register: AuthPayload;
}

interface LoginData {
  login: AuthPayload;
}

interface RegisterVars {
  username: string;
  email: string;
  password: string;
}

interface LoginVars {
  email: string;
  password: string;
}

function UserAuth() {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);

  const [register, { loading: registering, error: registerError }] =
    useMutation<RegisterData, RegisterVars>(REGISTER_MUTATION);

  const [login, { loading: loggingIn, error: loginError }] = useMutation<
    LoginData,
    LoginVars
  >(LOGIN_MUTATION);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !registerForm.username.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password.trim()
    ) {
      return;
    }

    const result = await register({
      variables: {
        username: registerForm.username.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      },
    });

    const token = result.data?.register.token;
    if (token) {
      localStorage.setItem("authToken", token);
      setStatusMessage("Registered and authenticated");
    }

    setRegisterForm({ username: "", email: "", password: "" });
  };

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      return;
    }

    const result = await login({
      variables: {
        email: loginForm.email.trim(),
        password: loginForm.password,
      },
    });

    const token = result.data?.login.token;

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard");
      setStatusMessage("Logged in and authenticated");
    }

    setLoginForm({ email: "", password: "" });
  };

  return (
    <section className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm auth-card">
        <div className="navbar-brand mb-0 fw-bold">
          <h2>Welcome to SymptomIQ!</h2>
        </div>
        {isLoginView ? (
          <form onSubmit={handleLogin}>
            <div className="navbar-brand mb-0 fw-bold">
              <h3>Login</h3>
            </div>
            <label className="form-label fw-semibold" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={loginForm.email}
              onChange={event =>
                setLoginForm(prev => ({ ...prev, email: event.target.value }))
              }
              className="form-control"
              placeholder="Enter email"
              disabled={loggingIn}
            />

            <label className="form-label fw-semibold" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={loginForm.password}
              onChange={event =>
                setLoginForm(prev => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              className="form-control"
              placeholder="Enter password"
              disabled={loggingIn}
            />

            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={loggingIn}
            >
              {loggingIn ? "Logging in..." : "Login"}
            </button>

            <p className="text-white-50 small">
              Don&apos;t have an account?{" "}
              <button
                className="btn btn-outline-light btn-sm"
                type="button"
                onClick={() => setIsLoginView(false)}
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="navbar-brand mb-0 fw-bold">
              <h3>Register</h3>
            </div>
            <label
              className="form-label fw-semibold"
              htmlFor="register-username"
            >
              Username
            </label>
            <input
              id="register-username"
              value={registerForm.username}
              onChange={event =>
                setRegisterForm(prev => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              className="form-control"
              placeholder="Enter username"
              disabled={registering}
            />

            <label className="form-label fw-semibold" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={registerForm.email}
              onChange={event =>
                setRegisterForm(prev => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              className="form-control"
              placeholder="Enter email"
              disabled={registering}
            />

            <label
              className="form-label fw-semibold"
              htmlFor="register-password"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={registerForm.password}
              onChange={event =>
                setRegisterForm(prev => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              className="form-control"
              placeholder="Enter password"
              disabled={registering}
            />

            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={registering}
            >
              {registering ? "Registering..." : "Register"}
            </button>

            <p className="text-white-50 small">
              Already have an account?{" "}
              <button
                className="btn btn-outline-light btn-sm"
                type="button"
                onClick={() => setIsLoginView(true)}
              >
                Login
              </button>
            </p>
          </form>
        )}

        {registerError && <p>Register error: {registerError.message}</p>}
        {loginError && <p>Login error: {loginError.message}</p>}
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </section>
  );
}

export default UserAuth;
