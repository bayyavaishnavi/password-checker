import { useMemo, useState } from "react";
import "./LoginPage.css";

const RegisterPage = ({ onRegisterSubmit, onGoToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isEmailValid) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (
      !passwordChecks.length ||
      !passwordChecks.uppercase ||
      !passwordChecks.number ||
      !passwordChecks.special
    ) {
      nextErrors.password =
        "Use 8+ chars with at least 1 uppercase letter, 1 number, and 1 special character.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onRegisterSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="login-card">
      <div className="login-glow" aria-hidden="true"></div>

      <p className="login-badge">Create Account</p>
      <h2>Get started</h2>
      <p className="login-subtitle">Register to access your Password Strength Checker dashboard.</p>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            name="register-name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="field-group">
          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            name="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field-group">
          <label htmlFor="register-password">Password</label>
          <div className="login-password-wrap">
            <input
              id="register-password"
              name="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined, confirmPassword: undefined }));
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

        <div className="field-group">
          <label htmlFor="register-confirm-password">Confirm Password</label>
          <input
            id="register-confirm-password"
            name="register-confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="login-submit">
          Create Account
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" className="auth-switch-btn" onClick={onGoToLogin}>
          Sign In
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
