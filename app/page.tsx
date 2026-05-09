"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      router.push(email === "admin@securebank.com" ? "/admin" : "/dashboard");
    } else {
      setError(result.error || "Login failed.");
    }
  };

  const fillCreds = (e: string, p: string) => { setEmail(e); setPassword(p); setError(""); };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left — Login Form */}
      <div style={{ flex: "0 0 480px", background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 48px", boxShadow: "4px 0 24px rgba(0,0,0,0.08)", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <div style={{ width: "44px", height: "44px", background: "var(--navy)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={24} color="var(--gold)" />
          </div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--navy)" }}>
              SECURE<span style={{ color: "var(--gold)" }}>BANK</span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "2px", fontFamily: "Trebuchet MS, sans-serif" }}>YOUR TRUSTED PARTNER</div>
          </div>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--navy)", marginBottom: "8px" }}>Welcome Back</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "36px", fontFamily: "Trebuchet MS, sans-serif", fontSize: "14px" }}>Sign in to access your account securely</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--navy)", marginBottom: "8px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px" }}>EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@securebank.com" required
              style={{ width: "100%", padding: "13px 16px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "Trebuchet MS, sans-serif", color: "var(--navy)", outline: "none", background: "#fafafa" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--navy)", marginBottom: "8px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px" }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required
                style={{ width: "100%", padding: "13px 48px 13px 16px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "Trebuchet MS, sans-serif", color: "var(--navy)", outline: "none", background: "#fafafa" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: "28px" }}>
            <a href="#" style={{ fontSize: "13px", color: "var(--gold)", textDecoration: "none", fontFamily: "Trebuchet MS, sans-serif" }}>Forgot password?</a>
          </div>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", padding: "12px 16px", color: "var(--danger)", fontSize: "13px", marginBottom: "20px", fontFamily: "Trebuchet MS, sans-serif" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#aaa" : "var(--navy)", color: "var(--gold)", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "1.5px", fontFamily: "Trebuchet MS, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Lock size={15} />
            {loading ? "SIGNING IN..." : "SIGN IN SECURELY"}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: "36px", padding: "16px", background: "var(--off-white)", borderRadius: "8px", border: "1px solid #e8e0d0" }}>
          <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "1.5px", marginBottom: "10px", fontFamily: "Trebuchet MS, sans-serif" }}>DEMO CREDENTIALS</p>
          {[
            { label: "Priya (India)", email: "priya@securebank.com", pass: "Test@123" },
            { label: "Alex (Australia)", email: "alex@securebank.com", pass: "Test@123" },
            { label: "Admin", email: "admin@securebank.com", pass: "Admin@123" },
          ].map((c) => (
            <button key={c.email} type="button" onClick={() => fillCreds(c.email, c.pass)}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "3px 0", fontSize: "12px", color: "var(--navy-light)", fontFamily: "Trebuchet MS, sans-serif" }}>
              <span style={{ fontWeight: "700" }}>{c.label}:</span> {c.email}
            </button>
          ))}
        </div>
      </div>

      {/* Right — Banner */}
      <div style={{ flex: 1, background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 60%, #0d2347 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px", position: "relative", overflow: "hidden" }}>
        {[{ s: 400, t: "-100px", r: "-100px" }, { s: 300, b: "-80px", l: "-80px" }, { s: 200, t: "40%", r: "10%" }].map((c, i) => (
          <div key={i} style={{ position: "absolute", width: `${c.s}px`, height: `${c.s}px`, borderRadius: "50%", border: "1px solid var(--gold)", top: c.t, bottom: c.b, right: c.r, left: c.l, opacity: 0.05 }} />
        ))}
        <div style={{ width: "60px", height: "3px", background: "var(--gold)", marginBottom: "32px" }} />
        <h2 style={{ color: "#fff", fontSize: "40px", fontWeight: "700", textAlign: "center", lineHeight: "1.2", marginBottom: "24px", maxWidth: "480px" }}>
          Banking Built on <span style={{ color: "var(--gold)" }}>Trust</span> & <span style={{ color: "var(--gold)" }}>Security</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "16px", textAlign: "center", maxWidth: "380px", lineHeight: "1.7", fontFamily: "Trebuchet MS, sans-serif", marginBottom: "48px" }}>
          Protect your finances with industry-leading security. Trusted by over 2 million customers worldwide.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {["256-bit Encryption", "24/7 Monitoring", "FDIC Insured"].map((f) => (
            <div key={f} style={{ padding: "9px 18px", border: "1px solid rgba(201,168,76,0.35)", borderRadius: "24px", color: "var(--gold-light)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", background: "rgba(201,168,76,0.06)" }}>{f}</div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: "28px", color: "rgba(255,255,255,0.25)", fontSize: "11px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1.5px" }}>
          © 2026 SECUREBANK. ALL RIGHTS RESERVED.
        </div>
      </div>
    </div>
  );
}
