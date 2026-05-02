import { Link, useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { useAdminAuth } from "@/components/admin-auth";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAdminAuth();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/crm", label: "CRM" },
    { href: "/admin/candidates", label: "Candidates" },
    { href: "/admin/matching", label: "Matching" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-28 bg-card border border-border p-4 rounded-md">
            <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Admin</h2>
            <nav className="flex flex-col gap-2 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                    location === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/5 gap-2"
                data-testid="button-admin-logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
