import { useEffect, useState } from "react";
import PasswordStrength from "./PasswordStrength";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import "./App.css";

const REGISTERED_USER_KEY = "passguard_registered_user";

const getCurrentRoute = () => {
  if (window.location.hash === "#/login") {
    return "login";
  }

  if (window.location.hash === "#/checker") {
    return "checker";
  }

  if (window.location.hash === "#/home") {
    return "home";
  }

  if (window.location.hash === "#/register") {
    return "register";
  }

  return "login";
};

function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(() => {
    const savedUser = localStorage.getItem(REGISTERED_USER_KEY);
    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });
  const [loginNotice, setLoginNotice] = useState("");
  const canAccessChecker = isAuthenticated && route === "checker";
  const isHomeRoute = isAuthenticated && route === "home";

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#/login";
    }

    const handleHashChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if ((route === "checker" || route === "home") && !isAuthenticated) {
      window.location.hash = "#/login";
      setRoute("login");
    }
  }, [route, isAuthenticated]);

  const navigateTo = (nextRoute) => {
    if (nextRoute === "checker" && !isAuthenticated) {
      return;
    }

    if (nextRoute === "login") {
      window.location.hash = "#/login";
      return;
    }

    if (nextRoute === "home") {
      if (!isAuthenticated) {
        return;
      }
      window.location.hash = "#/home";
      return;
    }

    if (nextRoute === "register") {
      window.location.hash = "#/register";
      return;
    }

    window.location.hash = "#/checker";
  };

  const handleLoginAttempt = ({ email, password }) => {
    if (!registeredUser) {
      return "No registered account found. Please register first.";
    }

    const normalizedEmail = email.trim().toLowerCase();
    const registeredEmail = registeredUser.email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const registeredPassword = (registeredUser.password ?? "").trim();

    if (normalizedEmail !== registeredEmail || normalizedPassword !== registeredPassword) {
      return "Registered email and password do not match.";
    }

    setIsAuthenticated(true);
    setLoginNotice("");
    window.location.hash = "#/home";
    return null;
  };

  const handleRegisterSubmit = ({ name, email, password }) => {
    const nextUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };
    setRegisteredUser(nextUser);
    localStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(nextUser));
    setIsAuthenticated(false);
    setLoginNotice("Registration successful. Please login with your registered email and password.");
    window.location.hash = "#/login";
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginNotice("You have been logged out.");
    window.location.hash = "#/login";
  };

  return (
    <div className="app-shell">
      <div className="bg-noise" aria-hidden="true"></div>
      <div className="bg-orb orb-a" aria-hidden="true"></div>
      <div className="bg-orb orb-b" aria-hidden="true"></div>
      <div className="bg-grid" aria-hidden="true"></div>

      <header className="top-nav">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true"></span>
          <span>PassGuard</span>
        </div>
        <nav className="nav-links" aria-label="Primary">
          {!isAuthenticated && (
            <>
              <button
                type="button"
                className={`nav-link ${route === "login" ? "active" : ""}`}
                onClick={() => navigateTo("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`nav-link ${route === "register" ? "active" : ""}`}
                onClick={() => navigateTo("register")}
              >
                Register
              </button>
            </>
          )}
          {isAuthenticated && (
            <button
              type="button"
              className={`nav-link ${route === "home" ? "active" : ""}`}
              onClick={() => navigateTo("home")}
            >
              Home
            </button>
          )}
          {isAuthenticated && (
            <button
              type="button"
              className={`nav-link ${route === "checker" ? "active" : ""}`}
              onClick={() => navigateTo("checker")}
            >
              Password Checker
            </button>
          )}
          {isAuthenticated && (
            <button type="button" className="nav-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className={`app-container ${isHomeRoute ? "home-layout" : ""}`}>
        <section className={`checker-panel ${isHomeRoute ? "home-panel" : ""}`} aria-live="polite">
          {isAuthenticated && route === "home" && <HomePage userName={registeredUser?.name} />}
          {canAccessChecker && <PasswordStrength />}
          {!isAuthenticated && route === "register" && (
            <RegisterPage
              onRegisterSubmit={handleRegisterSubmit}
              onGoToLogin={() => navigateTo("login")}
            />
          )}
          {!isAuthenticated && route !== "register" && (
            <LoginPage
              onLoginAttempt={handleLoginAttempt}
              onGoToRegister={() => navigateTo("register")}
              loginNotice={loginNotice}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
