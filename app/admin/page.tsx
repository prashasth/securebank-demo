"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/data";
import NavBar from "@/components/NavBar";
import { Users, Activity, Shield, CheckCircle, XCircle, Eye } from "lucide-react";

export default function AdminPage() {
  const { user, users, transactions, disabledUsers, toggleUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "transactions">("users");

  useEffect(() => {
    if (!user) router.replace("/");
    if (user && user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const customers = users.filter((u) => u.role === "customer");
  const allTxns = transactions;

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      <NavBar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--navy)", marginBottom: "4px" }}>Admin Console</h1>
          <p style={{ color: "var(--text-muted)", fontFamily: "Trebuchet MS, sans-serif", fontSize: "14px" }}>Manage users, view transactions, and monitor account activity</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "28px" }}>
          {[
            { label: "TOTAL CUSTOMERS", value: customers.length, icon: <Users size={20} color="var(--gold)" />, bg: "var(--navy)" },
            { label: "ACTIVE ACCOUNTS", value: customers.length - disabledUsers.length, icon: <CheckCircle size={20} color="var(--success)" />, bg: "#fff" },
            { label: "DISABLED ACCOUNTS", value: disabledUsers.length, icon: <XCircle size={20} color="var(--danger)" />, bg: "#fff" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: "14px", padding: "22px", border: stat.bg === "#fff" ? "1px solid #eee" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "11px", color: stat.bg === "var(--navy)" ? "rgba(255,255,255,0.5)" : "var(--text-muted)", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1.5px", marginBottom: "10px" }}>{stat.label}</p>
                  <p style={{ fontSize: "32px", fontWeight: "700", color: stat.bg === "var(--navy)" ? "#fff" : "var(--navy)" }}>{stat.value}</p>
                </div>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: stat.bg === "var(--navy)" ? "rgba(201,168,76,0.15)" : "var(--off-white)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
          {[{ key: "users", label: "User Management", icon: <Users size={14} /> }, { key: "transactions", label: "Audit Log", icon: <Activity size={14} /> }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as "users" | "transactions")}
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 20px", borderRadius: "8px", border: "1.5px solid", cursor: "pointer", fontSize: "13px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600",
                background: activeTab === tab.key ? "var(--navy)" : "#fff",
                color: activeTab === tab.key ? "var(--gold)" : "var(--text-muted)",
                borderColor: activeTab === tab.key ? "var(--navy)" : "#ddd",
              }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eee", overflow: "hidden" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
              <Shield size={16} color="var(--navy)" />
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "var(--navy)" }}>Customer Accounts</h2>
            </div>
            {customers.map((u, i) => {
              const isDisabled = disabledUsers.includes(u.id);
              const txnCount = transactions.filter((t) => t.userId === u.id).length;
              return (
                <div key={u.id} style={{ padding: "22px 28px", borderBottom: i < customers.length - 1 ? "1px solid #f5f5f5" : "none", display: "flex", alignItems: "center", gap: "16px", opacity: isDisabled ? 0.6 : 1 }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: isDisabled ? "#ccc" : "var(--navy)", color: isDisabled ? "#999" : "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", flexShrink: 0 }}>
                    {u.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <p style={{ fontWeight: "700", color: "var(--navy)", fontSize: "15px" }}>{u.name}</p>
                      <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "11px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "700", background: isDisabled ? "rgba(229,62,62,0.1)" : "rgba(56,161,105,0.1)", color: isDisabled ? "var(--danger)" : "var(--success)" }}>
                        {isDisabled ? "DISABLED" : "ACTIVE"}
                      </span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif" }}>{u.email} · {u.accountNumber} · {u.country}</p>
                  </div>
                  <div style={{ textAlign: "right", marginRight: "24px" }}>
                    <p style={{ fontWeight: "700", color: "var(--navy)", fontSize: "15px" }}>{formatCurrency(u.balance, u.currency)}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif" }}>{txnCount} transactions</p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => alert(`Viewing activity for ${u.name}`)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: "var(--off-white)", border: "1px solid #ddd", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600", color: "var(--navy)" }}>
                      <Eye size={13} />VIEW
                    </button>
                    <button onClick={() => toggleUser(u.id)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", background: isDisabled ? "rgba(56,161,105,0.1)" : "rgba(229,62,62,0.08)", border: `1px solid ${isDisabled ? "rgba(56,161,105,0.3)" : "rgba(229,62,62,0.3)"}`, borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "700", color: isDisabled ? "var(--success)" : "var(--danger)" }}>
                      {isDisabled ? <><CheckCircle size={13} />ENABLE</> : <><XCircle size={13} />DISABLE</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === "transactions" && (
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eee", overflow: "hidden" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
              <Activity size={16} color="var(--navy)" />
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "var(--navy)" }}>All Transactions</h2>
            </div>
            {allTxns.map((txn, i) => {
              const txnUser = users.find((u) => u.id === txn.userId);
              return (
                <div key={txn.id} style={{ padding: "16px 28px", borderBottom: i < allTxns.length - 1 ? "1px solid #f5f5f5" : "none", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: txn.type === "credit" ? "rgba(56,161,105,0.1)" : "rgba(229,62,62,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {txn.type === "credit" ? <CheckCircle size={16} color="var(--success)" /> : <Activity size={16} color="var(--danger)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "600", color: "var(--navy)", fontSize: "14px" }}>{txn.description}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif" }}>{txnUser?.name} · {txn.date}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: "700", fontSize: "14px", color: txn.type === "credit" ? "var(--success)" : "var(--danger)" }}>
                      {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount, txnUser?.currency || "USD")}
                    </p>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Trebuchet MS, sans-serif" }}>{txn.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
