
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <Dashboard />
    </Layout>
  );
};

export default DashboardPage;
