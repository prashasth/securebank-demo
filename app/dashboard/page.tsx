"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useUser } from "@descope/nextjs-sdk/client";
import { formatCurrency } from "@/lib/data";
import NavBar from "@/components/NavBar";
import { TrendingUp, TrendingDown, ArrowRight, CreditCard, Activity, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, transactions, logout } = useAuth();
  const { user: descopeUser } = useUser();
  const router = useRouter();

  const isAuthenticated = !!descopeUser?.email;

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
    if (user?.role === "admin") router.replace("/admin");
  }, [user, router, isAuthenticated]);

  if (!isAuthenticated) return null;

  if (!user) {
    const name = descopeUser?.name || descopeUser?.email || "there";
    return (
      <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
        <NavBar />
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", background: "var(--navy)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Shield size={32} color="var(--gold)" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--navy)", marginBottom: "12px" }}>
            Welcome to <span style={{ color: "var(--gold)" }}>SecureBank</span>, {name}!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", fontFamily: "Trebuchet MS, sans-serif", lineHeight: "1.7", marginBottom: "32px" }}>
            Your identity has been verified successfully. Your bank account is being set up and will be ready shortly. Please contact your branch for further assistance.
          </p>
          <button onClick={logout}
            style={{ padding: "12px 28px", background: "var(--navy)", color: "var(--gold)", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px" }}>
            SIGN OUT
          </button>
        </div>
      </div>
    );
  }

  if (user.role === "admin") return null;

  const txns = transactions.filter((t) => t.userId === user.id).slice(0, 5);
  const credits = txns.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const debits = txns.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      <NavBar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--navy)", marginBottom: "4px" }}>
            Good morning, {user.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontFamily: "Trebuchet MS, sans-serif", fontSize: "14px" }}>
            Here&apos;s your financial overview for today
          </p>
        </div>

        {/* Cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "32px" }}>
          {/* Balance Card */}
          <div style={{ background: "var(--navy)", borderRadius: "16px", padding: "28px", gridColumn: "span 1", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <CreditCard size={16} color="var(--gold)" />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1.5px" }}>ACCOUNT BALANCE</span>
            </div>
            <div style={{ fontSize: "34px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
              {formatCurrency(user.balance, user.currency)}
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif" }}>
              Account: {user.accountNumber}
            </div>
            <div style={{ marginTop: "20px", height: "2px", background: "rgba(201,168,76,0.3)", borderRadius: "1px" }}>
              <div style={{ width: "65%", height: "100%", background: "var(--gold)", borderRadius: "1px" }} />
            </div>
          </div>

          {/* Income */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px", marginBottom: "12px" }}>MONEY IN</p>
                <p style={{ fontSize: "26px", fontWeight: "700", color: "var(--success)" }}>{formatCurrency(credits, user.currency)}</p>
              </div>
              <div style={{ width: "40px", height: "40px", background: "rgba(56,161,105,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={20} color="var(--success)" />
              </div>
            </div>
          </div>

          {/* Spending */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px", marginBottom: "12px" }}>MONEY OUT</p>
                <p style={{ fontSize: "26px", fontWeight: "700", color: "var(--danger)" }}>{formatCurrency(debits, user.currency)}</p>
              </div>
              <div style={{ width: "40px", height: "40px", background: "rgba(229,62,62,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingDown size={20} color="var(--danger)" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eee", overflow: "hidden" }}>
          <div style={{ padding: "24px 28px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Activity size={18} color="var(--navy)" />
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "var(--navy)" }}>Recent Transactions</h2>
            </div>
            <button onClick={() => router.push("/transfer")}
              style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: "13px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600" }}>
              New Transfer <ArrowRight size={14} />
            </button>
          </div>

          {txns.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontFamily: "Trebuchet MS, sans-serif" }}>No transactions yet</div>
          ) : (
            txns.map((txn, i) => (
              <div key={txn.id}
                style={{ display: "flex", alignItems: "center", padding: "18px 28px", borderBottom: i < txns.length - 1 ? "1px solid #f5f5f5" : "none", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px", background: txn.type === "credit" ? "rgba(56,161,105,0.1)" : "rgba(229,62,62,0.08)" }}>
                  {txn.type === "credit" ? <TrendingUp size={18} color="var(--success)" /> : <TrendingDown size={18} color="var(--danger)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: "600", color: "var(--navy)", fontSize: "14px", marginBottom: "2px" }}>{txn.description}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif" }}>{txn.date}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: "700", fontSize: "15px", color: txn.type === "credit" ? "var(--success)" : "var(--danger)" }}>
                    {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount, user.currency)}
                  </p>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "12px", fontFamily: "Trebuchet MS, sans-serif", background: "rgba(56,161,105,0.1)", color: "var(--success)" }}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
