import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError("All fields required"); return; }
    setLoading(true); setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4, pointerEvents: "none" }} />

      <div className="animate-fade" style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "4px", marginBottom: "12px", textTransform: "uppercase" }}>SYSTEM ACCESS</div>
          <h1 className="mono" style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-1px" }}>TaskFlow</h1>
          <div style={{ width: "40px", height: "2px", background: "var(--text-primary)", margin: "12px auto 0" }} />
        </div>

        {/* Card */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "32px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>Sign in</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Continue to your workspace</p>
          </div>

          {error && (
            <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.3)", borderRadius: "6px", padding: "10px 14px", marginBottom: "20px", fontSize: "13px", color: "var(--red)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: "60px" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "var(--bg-elevated)" : "var(--text-primary)", color: "var(--bg-base)", border: "none", borderRadius: "6px", padding: "12px", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.target.style.opacity = "1"; }}>
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)", marginTop: "24px" }}>
            New here?{" "}
            <Link to="/register" style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid var(--border-bright)" }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
