"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useUser, useSession, useDescope } from "@descope/nextjs-sdk/client";
import { User, Transaction, USERS, TRANSACTIONS } from "./data";

type AppContextType = {
  user: User | null;
  users: User[];
  transactions: Transaction[];
  disabledUsers: string[];
  logout: () => void;
  toggleUser: (id: string) => void;
  transfer: (recipientId: string, amount: number, note: string) => { success: boolean; error?: string };
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: descopeUser } = useUser();
  const { isAuthenticated } = useSession();
  const { logout: descopeLogout } = useDescope();

  const [users, setUsers] = useState<User[]>(USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [disabledUsers, setDisabledUsers] = useState<string[]>([]);

  // Map Descope session user to local business data by email
  const user: User | null = isAuthenticated && descopeUser?.email
    ? users.find((u) => u.email.toLowerCase() === descopeUser.email!.toLowerCase()) ?? null
    : null;

  const logout = () => descopeLogout();

  const toggleUser = (id: string) => {
    setDisabledUsers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
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

    const recipient = users.find((u) => u.id === recipientId);
    setTransactions((prev) => [
      { id: `${txnId}-debit`, userId: user.id, type: "debit", amount, description: note || `Transfer to ${recipient?.name}`, date: today, status: "completed" },
      { id: `${txnId}-credit`, userId: recipientId, type: "credit", amount, description: note || `Transfer from ${user.name}`, date: today, status: "completed" },
      ...prev,
    ]);

    return { success: true };
  };

  return (
    <AppContext.Provider value={{ user, users, transactions, disabledUsers, logout, toggleUser, transfer }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAuth must be used within AppProvider");
  return ctx;
}
