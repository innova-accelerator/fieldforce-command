
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import CustomerManagement from '../components/CustomerManagement';
import JobManagement from '../components/JobManagement';
import AssociateDirectory from '../components/AssociateDirectory';
import Scheduling from '../components/Scheduling';
import Settings from '../components/Settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
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
