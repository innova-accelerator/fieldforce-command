
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="associates" element={<AssociatesPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="people" element={<PeoplePage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:jobId/overview" element={<JobOverview />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
