import { useMemo, useState } from "react";
import "./PasswordStrength.css";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
const HISTORY_LIMIT = 3;
const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password123",
  "admin",
  "admin123",
  "qwerty",
  "qwerty123",
  "123456",
  "12345678",
  "abc123",
  "iloveyou",
  "welcome",
]);

const shuffle = (value) =>
  value
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

const createPasswordByLevel = (level) => {
  if (level === "weak") {
    const chars = CHARSETS.lowercase + CHARSETS.numbers;
    let output = "";
    for (let i = 0; i < 6; i += 1) {
      output += getRandomChar(chars);
    }
    return output;
  }

  if (level === "medium") {
    const required = [
      getRandomChar(CHARSETS.lowercase),
      getRandomChar(CHARSETS.uppercase),
      getRandomChar(CHARSETS.numbers),
    ];
    const pool = CHARSETS.lowercase + CHARSETS.uppercase + CHARSETS.numbers;
    while (required.length < 10) {
      required.push(getRandomChar(pool));
    }
    return shuffle(required.join(""));
  }

  const required = [
    getRandomChar(CHARSETS.lowercase),
    getRandomChar(CHARSETS.uppercase),
    getRandomChar(CHARSETS.numbers),
    getRandomChar(CHARSETS.symbols),
  ];
  const pool = CHARSETS.lowercase + CHARSETS.uppercase + CHARSETS.numbers + CHARSETS.symbols;
  while (required.length < 14) {
    required.push(getRandomChar(pool));
  }
  return shuffle(required.join(""));
};

const PasswordStrength = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isCommonWeakPassword = COMMON_WEAK_PASSWORDS.has(password.trim().toLowerCase());

  const score = useMemo(() => {
    if (!password) return 0;

    let nextScore = 0;
    if (password.length >= 8) nextScore += 20;
    if (password.length >= 12) nextScore += 15;
    if (password.length >= 16) nextScore += 10;
    if (/[a-z]/.test(password)) nextScore += 10;
    if (rules.uppercase) nextScore += 15;
    if (rules.number) nextScore += 15;
    if (rules.special) nextScore += 20;

    if (/(.)\1{2,}/.test(password)) nextScore -= 10;
    if (/1234|abcd|qwerty/i.test(password)) nextScore -= 10;
    if (isCommonWeakPassword) nextScore = Math.min(nextScore, 20);

    return Math.max(0, Math.min(100, nextScore));
  }, [password, rules.uppercase, rules.number, rules.special, isCommonWeakPassword]);

  const strength = useMemo(() => {
    if (!password) return 0;
    if (score < 30) return 1;
    if (score < 60) return 2;
    if (score < 80) return 3;
    return 4;
  }, [password, score]);

  const strengthMeta = useMemo(() => {
    if (!password) {
      return { label: "Start typing", hint: "Use 8+ chars with mixed character types." };
    }

    if (strength <= 1) {
      return { label: "Weak", hint: "Easy to guess. Add uppercase, numbers and symbols." };
    }

    if (strength <= 3) {
      return { label: "Medium", hint: "Good start. Add one more missing rule to make it strong." };
    }

    return { label: "Strong", hint: "Great choice. This password is difficult to crack." };
  }, [password, strength]);

  const handleGenerate = (level) => {
    const generated = createPasswordByLevel(level);
    setPassword(generated);
    setShowPassword(true);
    setCopied(false);
    setHistory((prev) => [generated, ...prev.filter((item) => item !== generated)].slice(0, HISTORY_LIMIT));
  };

  const handleCopy = async () => {
    if (!password) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="card">
      <p className="badge">Security Toolkit</p>
      <h2>Password Strength Checker</h2>
      <p className="subtitle">Generate weak, medium, or strong passwords and test them instantly.</p>

      <div className="password-box">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setCopied(false);
          }}
        />
        <button
          className="eye"
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
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

      <div className="generate-actions">
        <button type="button" className="generate-btn weak-btn" onClick={() => handleGenerate("weak")}>
          Generate Weak
        </button>
        <button type="button" className="generate-btn medium-btn" onClick={() => handleGenerate("medium")}>
          Generate Medium
        </button>
        <button type="button" className="generate-btn strong-btn" onClick={() => handleGenerate("strong")}>
          Generate Strong
        </button>
      </div>

      <div className="quick-actions">
        <button type="button" className="secondary-btn" onClick={handleCopy} disabled={!password}>
          {copied ? "Copied" : "Copy Password"}
        </button>
      </div>

      <div className="strength-bar">
        <div className={`strength-fill strength-${strength}`}></div>
      </div>

      <div className="strength-row">
        <p className={`strength-text strength-${strength}`}>{strengthMeta.label}</p>
        <p className="char-count">{password.length} chars | {score}/100</p>
      </div>
      <p className="strength-hint">{strengthMeta.hint}</p>
      {isCommonWeakPassword && <p className="warning-banner">This is a commonly used password. Avoid using it.</p>}

      <ul className="rules">
        <li className={rules.length ? "ok" : "bad"}>
          <span className="status-icon">{rules.length ? "OK" : "NO"}</span> At least 8 characters
        </li>
        <li className={rules.uppercase ? "ok" : "bad"}>
          <span className="status-icon">{rules.uppercase ? "OK" : "NO"}</span> One uppercase letter
        </li>
        <li className={rules.number ? "ok" : "bad"}>
          <span className="status-icon">{rules.number ? "OK" : "NO"}</span> One number
        </li>
        <li className={rules.special ? "ok" : "bad"}>
          <span className="status-icon">{rules.special ? "OK" : "NO"}</span> One special character
        </li>
      </ul>

      {history.length > 0 && (
        <div className="history-section">
          <p className="history-title">Recent generated passwords</p>
          <div className="history-list">
            {history.map((entry) => (
              <button
                key={entry}
                type="button"
                className="history-item"
                onClick={() => {
                  setPassword(entry);
                  setShowPassword(true);
                  setCopied(false);
                }}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;

