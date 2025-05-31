
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
      <Route path="/dashboard" element={
        <Layout currentPage="dashboard" onNavigate={handleNavigate}>
          <DashboardPage />
        </Layout>
      } />
      <Route path="/customers" element={
        <Layout currentPage="customers" onNavigate={handleNavigate}>
          <CustomersPage />
        </Layout>
      } />
      <Route path="/associates" element={
        <Layout currentPage="associates" onNavigate={handleNavigate}>
          <AssociatesPage />
        </Layout>
      } />
      <Route path="/schedule" element={
        <Layout currentPage="schedule" onNavigate={handleNavigate}>
          <SchedulePage />
        </Layout>
      } />
      <Route path="/settings" element={
        <Layout currentPage="settings" onNavigate={handleNavigate}>
          <SettingsPage />
        </Layout>
      } />
      <Route path="/organizations" element={
        <Layout currentPage="organizations" onNavigate={handleNavigate}>
          <OrganizationsPage />
        </Layout>
      } />
      <Route path="/people" element={
        <Layout currentPage="people" onNavigate={handleNavigate}>
          <PeoplePage />
        </Layout>
      } />
      <Route path="/jobs" element={
        <Layout currentPage="jobs" onNavigate={handleNavigate}>
          <JobsPage />
        </Layout>
      } />
      <Route path="/jobs/:jobId/overview" element={
        <Layout currentPage="jobs" onNavigate={handleNavigate}>
          <JobOverview />
        </Layout>
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
