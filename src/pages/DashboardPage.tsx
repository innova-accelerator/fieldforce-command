
import React from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  return (
    <Layout currentPage="dashboard" onNavigate={() => {}}>
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
