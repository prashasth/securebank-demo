"use client";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { Shield, LayoutDashboard, ArrowLeftRight, Users, LogOut, Bell } from "lucide-react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const handleLogout = () => { logout(); router.push("/"); };

  const navItems = user?.role === "admin"
    ? [{ label: "Admin Panel", href: "/admin", icon: <Users size={16} /> }]
    : [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
        { label: "Transfer", href: "/transfer", icon: <ArrowLeftRight size={16} /> },
      ];

  return (
    <nav style={{ background: "var(--navy)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => router.push(user?.role === "admin" ? "/admin" : "/dashboard")}>
        <div style={{ width: "34px", height: "34px", background: "rgba(201,168,76,0.15)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(201,168,76,0.3)" }}>
          <Shield size={18} color="var(--gold)" />
        </div>
        <span style={{ color: "#fff", fontSize: "17px", fontWeight: "700", letterSpacing: "0.5px" }}>
          SECURE<span style={{ color: "var(--gold)" }}>BANK</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "4px" }}>
        {navItems.map((item) => (
          <button key={item.href} onClick={() => router.push(item.href)}
            style={{
              display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600", letterSpacing: "0.5px",
              background: path === item.href ? "rgba(201,168,76,0.15)" : "transparent",
              color: path === item.href ? "var(--gold)" : "rgba(255,255,255,0.65)",
              borderBottom: path === item.href ? "2px solid var(--gold)" : "2px solid transparent",
            }}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "4px" }}>
          <Bell size={18} />
        </button>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "var(--navy)" }}>
            {user?.avatar}
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: "13px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600", lineHeight: "1.2" }}>{user?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "Trebuchet MS, sans-serif" }}>{user?.country}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.25)", borderRadius: "6px", cursor: "pointer", color: "#fc8181", fontSize: "12px", fontFamily: "Trebuchet MS, sans-serif", fontWeight: "600" }}>
          <LogOut size={14} />LOGOUT
        </button>
      </div>
    </nav>
  );
}
