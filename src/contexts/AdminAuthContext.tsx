import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AdminUser {
  email: string;
  password: string; // demo only - client-side
  name?: string;
  createdAt: string;
}

interface AdminAuthContextType {
  currentAdmin: { email: string; name?: string } | null;
  admins: AdminUser[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  createAdmin: (email: string, password: string, name?: string) => { ok: boolean; error?: string };
  deleteAdmin: (email: string) => void;
}

const DEFAULT_ADMINS: AdminUser[] = [
  { email: "admin@mkstore.com", password: "mkadmin@2026", name: "M&K Admin", createdAt: new Date().toISOString() },
];

const STORAGE_ADMINS = "mk-admins-v1";
const STORAGE_SESSION = "mk-admin-session-v1";

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ADMINS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ADMINS;
  });
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; name?: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => { localStorage.setItem(STORAGE_ADMINS, JSON.stringify(admins)); }, [admins]);
  useEffect(() => {
    if (currentAdmin) localStorage.setItem(STORAGE_SESSION, JSON.stringify(currentAdmin));
    else localStorage.removeItem(STORAGE_SESSION);
  }, [currentAdmin]);

  const login = (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    const match = admins.find(a => a.email.toLowerCase() === e && a.password === password);
    if (!match) return { ok: false, error: "Invalid email or password" };
    setCurrentAdmin({ email: match.email, name: match.name });
    return { ok: true };
  };

  const logout = () => setCurrentAdmin(null);

  const createAdmin = (email: string, password: string, name?: string) => {
    const e = email.trim().toLowerCase();
    if (!e || !password) return { ok: false, error: "Email and password are required" };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };
    if (admins.some(a => a.email.toLowerCase() === e)) return { ok: false, error: "Admin with this email already exists" };
    setAdmins(prev => [...prev, { email: e, password, name, createdAt: new Date().toISOString() }]);
    return { ok: true };
  };

  const deleteAdmin = (email: string) => {
    setAdmins(prev => prev.filter(a => a.email.toLowerCase() !== email.toLowerCase()));
  };

  return (
    <AdminAuthContext.Provider value={{ currentAdmin, admins, login, logout, createAdmin, deleteAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
