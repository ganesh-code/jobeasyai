import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import AuthGuard from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import Jobs from "./pages/Jobs";
import AppliedJobs from "./pages/AppliedJobs";
import UserProfile from "@/pages/UserProfile";
import Upgrade from "@/pages/Upgrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/auth"
              element={
                <AuthGuard requireAuth={false}>
                  <Auth />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/onboarding"
              element={
                <AuthGuard>
                  <Onboarding />
                </AuthGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthGuard>
                  <Settings />
                </AuthGuard>
              }
            />
            <Route
              path="/find-jobs"
              element={
                <AuthGuard>
                  <Jobs />
                </AuthGuard>
              }
            />
            <Route
              path="/applied-jobs"
              element={
                <AuthGuard>
                  <AppliedJobs />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <UserProfile />
                </AuthGuard>
              }
            />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
