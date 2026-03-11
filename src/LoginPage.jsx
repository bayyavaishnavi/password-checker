import { useMemo, useState } from "react";
import "./LoginPage.css";

const GMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;

const LoginPage = ({ onLoginAttempt, onGoToRegister, loginNotice }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const validateForm = () => {
    const nextErrors = {};
    const isEmailValid = GMAIL_PATTERN.test(email.trim());

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isEmailValid) {
      nextErrors.email = "Enter a valid Gmail address ending with @gmail.com.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else {
      const hasLength = passwordChecks.length;
      const hasUppercase = passwordChecks.uppercase;
      const hasNumber = passwordChecks.number;
      const hasSpecial = passwordChecks.special;

      if (!hasLength || !hasUppercase || !hasNumber || !hasSpecial) {
        nextErrors.password =
          "Use 8+ chars with at least 1 uppercase letter, 1 number, and 1 special character.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const loginError = onLoginAttempt({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setErrors((prev) => ({ ...prev, auth: loginError }));
    }
  };

  return (
    <div className="login-card">
      <div className="login-glow" aria-hidden="true"></div>

      <p className="login-badge">Secure Access</p>
      <h2>Welcome back</h2>
      <p className="login-subtitle">Sign in to continue to your Password Strength Checker dashboard.</p>
      {loginNotice && <p className="auth-notice">{loginNotice}</p>}

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined, auth: undefined }));
            }}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field-group">
          <label htmlFor="login-password">Password</label>
          <div className="login-password-wrap">
            <input
              id="login-password"
              name="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined, auth: undefined }));
              }}
            />
            <button
              type="button"
              className="login-eye"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M3 3l18 18M10.6 10.6A2 2 0 0113.4 13.4M9.9 5.3A10.7 10.7 0 0112 5c5.2 0 9.4 4.1 10 7-.2.9-.8 2.1-1.8 3.2M6.2 6.2C3.9 7.8 2.4 10 2 12c.6 2.9 4.8 7 10 7 1.8 0 3.4-.5 4.8-1.3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M2 12c.6-2.9 4.8-7 10-7s9.4 4.1 10 7c-.6 2.9-4.8 7-10 7S2.6 14.9 2 12z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="login-meta">
          <label className="remember">
            <input type="checkbox" /> Keep me signed in
          </label>
        </div>

        <button type="submit" className="login-submit">
          Sign In
        </button>
        {errors.auth && <p className="field-error">{errors.auth}</p>}
      </form>

      <p className="auth-switch">
        New here?{" "}
        <button type="button" className="auth-switch-btn" onClick={onGoToRegister}>
          Create account
        </button>
      </p>
      <p className="login-footnote">Protected session. Your credentials are never stored in plain text.</p>
    </div>
  );
};

export default LoginPage;
