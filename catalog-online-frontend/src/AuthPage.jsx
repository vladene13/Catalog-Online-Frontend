import { useState } from "react";
import { LoginForm, RegisterForm } from "./components/Auth";
import "./components/Auth.css";

function AuthPage() {
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'

  return (
    <div className="auth-page">
      {authMode === "login" ? <LoginForm /> : <RegisterForm />}

      <div className="auth-switcher">
        {authMode === "login" ? (
          <p>
            Don't have an account?
            <button onClick={() => setAuthMode("register")}>
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?
            <button onClick={() => setAuthMode("login")}>Login here</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
