import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import Legal from "@/pages/legal";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCRM from "@/pages/admin/crm";
import AdminCandidates from "@/pages/admin/candidates";
import AdminMatching from "@/pages/admin/matching";
import ClientPortal from "@/pages/client/portal";
import { AdminAuthProvider } from "@/components/admin-auth";

const queryClient = new QueryClient();

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminAuthProvider>
      <Component />
    </AdminAuthProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/legal" component={Legal} />
      <Route path="/admin" component={() => <AdminRoute component={AdminDashboard} />} />
      <Route path="/admin/crm" component={() => <AdminRoute component={AdminCRM} />} />
      <Route path="/admin/candidates" component={() => <AdminRoute component={AdminCandidates} />} />
      <Route path="/admin/matching" component={() => <AdminRoute component={AdminMatching} />} />
      <Route path="/client" component={ClientPortal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
