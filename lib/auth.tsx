"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { User, Transaction, USERS, TRANSACTIONS } from "./data";

type AuthContextType = {
  user: User | null;
  users: User[];
  transactions: Transaction[];
  disabledUsers: string[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  toggleUser: (id: string) => void;
  transfer: (recipientId: string, amount: number, note: string) => { success: boolean; error?: string };
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [disabledUsers, setDisabledUsers] = useState<string[]>([]);

  const login = (email: string, password: string) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password." };
    if (disabledUsers.includes(found.id)) return { success: false, error: "Your account has been disabled. Please contact support." };
    setUser(found);
    return { success: true };
  };

  const logout = () => setUser(null);

  const toggleUser = (id: string) => {
    setDisabledUsers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    setUser((prev) => (prev?.id === id ? null : prev));
  };

  const transfer = (recipientId: string, amount: number, note: string) => {
    if (!user) return { success: false, error: "Not logged in." };
    const sender = users.find((u) => u.id === user.id);
    if (!sender || sender.balance < amount) return { success: false, error: "Insufficient balance." };

    const today = new Date().toISOString().split("T")[0];
    const txnId = `txn-${Date.now()}`;

    setUsers((prev) => prev.map((u) => {
      if (u.id === user.id) return { ...u, balance: u.balance - amount };
      if (u.id === recipientId) return { ...u, balance: u.balance + amount };
      return u;
    }));

    setUser((prev) => prev ? { ...prev, balance: prev.balance - amount } : null);

    const recipient = users.find((u) => u.id === recipientId);
    setTransactions((prev) => [
      { id: `${txnId}-debit`, userId: user.id, type: "debit", amount, description: note || `Transfer to ${recipient?.name}`, date: today, status: "completed" },
      { id: `${txnId}-credit`, userId: recipientId, type: "credit", amount, description: note || `Transfer from ${user.name}`, date: today, status: "completed" },
      ...prev,
    ]);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, users, transactions, disabledUsers, login, logout, toggleUser, transfer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
