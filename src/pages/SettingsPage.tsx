
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Settings from '../components/Settings';

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState('settings');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
