import { useState, useEffect, createContext, useContext } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ADMIN_PASSWORD = "aurum2025";
const STORAGE_KEY = "aurum_admin_auth";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  isAuthenticated: false,
  logout: () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setIsAuthenticated(true);
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Incorrect password. Please try again.");
      }
      setLoading(false);
    }, 600);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setPassword("");
  }

  if (checking) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Admin Access</h1>
            <p className="text-sm text-muted-foreground">Enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="bg-card border-border h-12 rounded-sm pr-12 text-white"
                data-testid="input-admin-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-destructive" data-testid="text-admin-error">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest text-sm rounded-sm"
              data-testid="button-admin-login"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "ACCESS DASHBOARD"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
