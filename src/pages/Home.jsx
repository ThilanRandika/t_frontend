import { Link } from "react-router-dom";
import { ShoppingBag, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">✨ Microservice Architecture Demo</div>
          <h1>
            The Future of World
            <br />
            <span>Online Shopping</span>
          </h1>
          <p>
            ShopEase is built on a cloud-native microservice architecture —
            independently deployable, fault-tolerant, and infinitely scalable.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="btn btn-primary">
              <ShoppingBag size={18} /> Shop Now
            </Link>
            <Link to="/register" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <div className="container">
        <div className="features">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Independent microservices that scale on demand with zero downtime.",
            },
            {
              icon: "🔐",
              title: "Secure by Design",
              desc: "JWT authentication, helmet, rate limiting and SAST scanning with Snyk.",
            },
            {
              icon: "☁️",
              title: "Cloud Native",
              desc: "Deployed on AWS ECS with Docker containers and MongoDB Atlas.",
            },
            {
              icon: "🔄",
              title: "CI/CD Pipelines",
              desc: "Automated build, test, security scan, and deploy via GitHub Actions.",
            },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Architecture ── */}
        <div className="card" style={{ padding: "2rem", marginBottom: "3rem" }}>
          <h2 className="section-title">🏗 Architecture</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                name: "Frontend",
                port: "5173",
                tech: "React + Vite",
                color: "#6c63ff",
                calls: "All 3 services",
              },
              {
                name: "User Service",
                port: "3001",
                tech: "Node.js + Express",
                color: "#43d9ad",
                calls: "MongoDB Atlas",
              },
              {
                name: "Product Service",
                port: "3002",
                tech: "Node.js + Express",
                color: "#ffd166",
                calls: "User Service + MongoDB",
              },
              {
                name: "Order Service",
                port: "3003",
                tech: "Node.js + Express",
                color: "#ff6584",
                calls: "User + Product Service",
              },
            ].map((s) => (
              <div
                key={s.name}
                style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-sm)",
                  padding: "1.25rem",
                  borderLeft: `3px solid ${s.color}`,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: s.color,
                    marginBottom: "0.35rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.name}
                </div>
                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                  :{s.port}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {s.tech}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  → {s.calls}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
