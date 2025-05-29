
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import CustomerManagement from '../components/CustomerManagement';
import JobManagement from '../components/JobManagement';
import AssociateDirectory from '../components/AssociateDirectory';
import Scheduling from '../components/Scheduling';
import Settings from '../components/Settings';
import { Button } from '../components/ui/button';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div>
            <Dashboard />
            {/* Demo link to job overview */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Job Overview Demo</h3>
              <p className="text-sm text-blue-700 mb-3">
                Experience the new responsive Job Overview workspace with real-time updates, task management, and timeline tracking.
              </p>
              <Link to="/jobs/demo-job-123/overview">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View Job Overview Demo
                </Button>
              </Link>
            </div>
          </div>
        );
      case 'customers':
        return <CustomerManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'associates':
        return <AssociateDirectory />;
      case 'schedule':
        return <Scheduling />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default Index;
