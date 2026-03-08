import "./HomePage.css";

const HomePage = ({ userName }) => {
  return (
    <div className="home-page">
      <section className="home-hero">
        <p className="home-badge">Welcome</p>
        <h1>Security Operations Dashboard</h1>
        <p className="home-subtitle">
          {userName ? `Hi ${userName},` : "Hi there,"} manage password quality with a secure, modern, and reliable
          workflow built for real-world usage.
        </p>
      </section>

      <section className="home-content">
        <div className="home-grid">
          <article className="home-tile">
            <p className="tile-label">Primary Tool</p>
            <h2>Password Strength Checker</h2>
            <p>Check password quality instantly, identify weak patterns, and generate stronger credentials faster.</p>
          </article>

          <article className="home-tile">
            <p className="tile-label">Security Standard</p>
            <h2>Policy-Driven Validation</h2>
            <p>Apply strict rules for length, uppercase letters, numbers, and symbols before acceptance.</p>
          </article>
        </div>

        <div className="home-footer-note">
          Use <strong>Password Checker</strong> in the navbar to begin live credential analysis.
        </div>
      </section>

      <footer className="home-footer">
        <p>PassGuard Security Suite</p>
        <p>Built for stronger digital identity protection</p>
      </footer>
    </div>
  );
};

export default HomePage;
