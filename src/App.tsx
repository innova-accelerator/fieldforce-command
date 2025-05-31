import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import CustomersPage from "./pages/CustomersPage";
import AssociatesPage from "./pages/AssociatesPage";
import SchedulePage from "./pages/SchedulePage";
import SettingsPage from "./pages/SettingsPage";
import JobOverview from "./pages/JobOverview";
import OrganizationsPage from "./pages/OrganizationsPage";
import PeoplePage from "./pages/PeoplePage";
import JobsPage from "./pages/JobsPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Helper component to extract current page from pathname
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getCurrentPage = (pathname: string) => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/jobs/') && pathname.includes('/overview')) return 'jobs';
    return pathname.slice(1) || 'home';
  };

  const currentPage = getCurrentPage(location.pathname);

  const handleNavigate = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout currentPage="dashboard" onNavigate={handleNavigate}>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute>
          <Layout currentPage="customers" onNavigate={handleNavigate}>
            <CustomersPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/associates" element={
        <ProtectedRoute>
          <Layout currentPage="associates" onNavigate={handleNavigate}>
            <AssociatesPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/schedule" element={
        <ProtectedRoute>
          <Layout currentPage="schedule" onNavigate={handleNavigate}>
            <SchedulePage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout currentPage="settings" onNavigate={handleNavigate}>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/organizations" element={
        <ProtectedRoute>
          <Layout currentPage="organizations" onNavigate={handleNavigate}>
            <OrganizationsPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/people" element={
        <ProtectedRoute>
          <Layout currentPage="people" onNavigate={handleNavigate}>
            <PeoplePage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/jobs" element={
        <ProtectedRoute>
          <Layout currentPage="jobs" onNavigate={handleNavigate}>
            <JobsPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/jobs/:jobId/overview" element={
        <ProtectedRoute>
          <Layout currentPage="jobs" onNavigate={handleNavigate}>
            <JobOverview />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <Layout currentPage="notfound" onNavigate={handleNavigate}>
          <NotFound />
        </Layout>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
