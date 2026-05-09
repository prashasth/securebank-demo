export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  country: string;
  currency: string;
  balance: number;
  accountNumber: string;
  avatar: string;
};

export type Transaction = {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
};

export const USERS: User[] = [
  {
    id: "user-priya",
    name: "Priya Sharma",
    email: "priya@securebank.com",
    password: "Test@123",
    role: "customer",
    country: "India",
    currency: "USD",
    balance: 50000,
    accountNumber: "SB-IN-4821",
    avatar: "PS",
  },
  {
    id: "user-alex",
    name: "Alex Thompson",
    email: "alex@securebank.com",
    password: "Test@123",
    role: "customer",
    country: "Australia",
    currency: "USD",
    balance: 5000,
    accountNumber: "SB-AU-7734",
    avatar: "AT",
  },
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@securebank.com",
    password: "Admin@123",
    role: "admin",
    country: "Global",
    currency: "USD",
    balance: 0,
    accountNumber: "SB-ADMIN",
    avatar: "AD",
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    userId: "user-priya",
    type: "credit",
    amount: 12000,
    description: "Salary Credit",
    date: "2026-05-01",
    status: "completed",
  },
  {
    id: "txn-002",
    userId: "user-priya",
    type: "debit",
    amount: 2500,
    description: "Electricity Bill",
    date: "2026-04-28",
    status: "completed",
  },
  {
    id: "txn-003",
    userId: "user-priya",
    type: "debit",
    amount: 1800,
    description: "Grocery Store",
    date: "2026-04-25",
    status: "completed",
  },
  {
    id: "txn-004",
    userId: "user-priya",
    type: "credit",
    amount: 5000,
    description: "Transfer from Alex",
    date: "2026-04-20",
    status: "completed",
  },
  {
    id: "txn-005",
    userId: "user-alex",
    type: "credit",
    amount: 3200,
    description: "Freelance Payment",
    date: "2026-05-02",
    status: "completed",
  },
  {
    id: "txn-006",
    userId: "user-alex",
    type: "debit",
    amount: 850,
    description: "Internet & Phone",
    date: "2026-04-29",
    status: "completed",
  },
  {
    id: "txn-007",
    userId: "user-alex",
    type: "debit",
    amount: 1200,
    description: "Restaurant Dinner",
    date: "2026-04-26",
    status: "completed",
  },
  {
    id: "txn-008",
    userId: "user-alex",
    type: "debit",
    amount: 5000,
    description: "Transfer to Priya",
    date: "2026-04-20",
    status: "completed",
  },
];

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    INR: "₹",
    AUD: "A$",
    USD: "$",
  };
  const symbol = symbols[currency] || "$";
  return `${symbol}${amount.toLocaleString()}`;
}
