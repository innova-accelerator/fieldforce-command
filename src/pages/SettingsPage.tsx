
import React from 'react';
import Layout from '../components/Layout';
import Settings from '../components/Settings';

const SettingsPage = () => {
  return (
    <Layout currentPage="settings" onNavigate={() => {}}>
      <Settings />
    </Layout>
  );
};

export default SettingsPage;
