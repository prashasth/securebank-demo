"use client";
import { useRouter } from "next/navigation";
import { Descope } from "@descope/nextjs-sdk";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (e: CustomEvent) => {
    const email = e.detail?.user?.email ?? "";
    router.push(email === "admin@securebank.com" ? "/admin" : "/dashboard");
  };

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

        {/* Descope Flow */}
        <Descope
          flowId="sign-up-or-in-bank"
          onSuccess={handleSuccess as never}
          onError={(e) => console.error("Auth error:", e)}
        />

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
