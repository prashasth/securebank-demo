"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/data";
import NavBar from "@/components/NavBar";
import { ArrowLeftRight, CheckCircle, AlertCircle } from "lucide-react";

export default function TransferPage() {
  const { user, users, transfer } = useAuth();
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!user) router.replace("/");
    if (user?.role === "admin") router.replace("/admin");
  }, [user, router]);

  if (!user || user.role === "admin") return null;

  const otherUsers = users.filter((u) => u.id !== user.id && u.role !== "admin");

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setResult({ success: false, message: "Please enter a valid amount." }); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const outcome = transfer(recipient, amt, note);
    setLoading(false);
    if (outcome.success) {
      setResult({ success: true, message: `Successfully transferred ${formatCurrency(amt, user.currency)} to ${users.find(u => u.id === recipient)?.name}.` });
      setAmount("");
      setNote("");
      setRecipient("");
    } else {
      setResult({ success: false, message: outcome.error ?? "Transfer failed." });
    }
  };

  const recipientUser = users.find((u) => u.id === recipient);

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)" }}>
      <NavBar />
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--navy)", marginBottom: "4px" }}>Money Transfer</h1>
          <p style={{ color: "var(--text-muted)", fontFamily: "Trebuchet MS, sans-serif", fontSize: "14px" }}>Send money to another SecureBank account</p>
        </div>

        {/* Balance chip */}
        <div style={{ background: "var(--navy)", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1.5px", marginBottom: "4px" }}>AVAILABLE BALANCE</p>
            <p style={{ color: "#fff", fontSize: "28px", fontWeight: "700" }}>{formatCurrency(user.balance, user.currency)}</p>
          </div>
          <div style={{ width: "48px", height: "48px", background: "rgba(201,168,76,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(201,168,76,0.3)" }}>
            <ArrowLeftRight size={22} color="var(--gold)" />
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #eee" }}>
          <form onSubmit={handleTransfer}>
            {/* Recipient */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--navy)", marginBottom: "8px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px" }}>RECIPIENT</label>
              <select value={recipient} onChange={(e) => setRecipient(e.target.value)} required
                style={{ width: "100%", padding: "13px 16px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "Trebuchet MS, sans-serif", color: recipient ? "var(--navy)" : "#aaa", outline: "none", background: "#fafafa", cursor: "pointer" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              >
                <option value="">Select a recipient...</option>
                {otherUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} — {u.accountNumber}</option>
                ))}
              </select>
              {recipientUser && (
                <div style={{ marginTop: "10px", padding: "12px 14px", background: "var(--off-white)", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>
                    {recipientUser.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: "600", color: "var(--navy)", fontSize: "13px" }}>{recipientUser.name}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "Trebuchet MS, sans-serif" }}>{recipientUser.country} · {recipientUser.accountNumber}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Amount */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--navy)", marginBottom: "8px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px" }}>AMOUNT ({user.currency})</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "16px", fontWeight: "700" }}>
                  $
                </span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="1" required
                  style={{ width: "100%", padding: "13px 16px 13px 40px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "18px", fontFamily: "Trebuchet MS, sans-serif", color: "var(--navy)", outline: "none", background: "#fafafa", fontWeight: "700" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
              </div>
              {/* Quick amounts */}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                {[50, 100, 500, 1000].map((v) => (
                  <button key={v} type="button" onClick={() => setAmount(String(v))}
                    style={{ padding: "5px 12px", background: amount === String(v) ? "var(--navy)" : "var(--off-white)", color: amount === String(v) ? "var(--gold)" : "var(--navy)", border: "1px solid #ddd", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600" }}>
                    ${v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "var(--navy)", marginBottom: "8px", fontFamily: "Trebuchet MS, sans-serif", letterSpacing: "1px" }}>NOTE (OPTIONAL)</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Rent payment, dinner split..."
                style={{ width: "100%", padding: "13px 16px", border: "1.5px solid #ddd", borderRadius: "8px", fontSize: "14px", fontFamily: "Trebuchet MS, sans-serif", color: "var(--navy)", outline: "none", background: "#fafafa" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            {result && (
              <div style={{ padding: "14px 16px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", background: result.success ? "rgba(56,161,105,0.08)" : "rgba(229,62,62,0.08)", border: `1px solid ${result.success ? "rgba(56,161,105,0.3)" : "rgba(229,62,62,0.3)"}` }}>
                {result.success ? <CheckCircle size={18} color="var(--success)" /> : <AlertCircle size={18} color="var(--danger)" />}
                <span style={{ fontSize: "13px", color: result.success ? "var(--success)" : "var(--danger)", fontFamily: "Trebuchet MS, sans-serif" }}>{result.message}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "15px", background: loading ? "#aaa" : "var(--navy)", color: "var(--gold)", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "1.5px", fontFamily: "Trebuchet MS, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <ArrowLeftRight size={15} />
              {loading ? "PROCESSING..." : "SEND MONEY"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
