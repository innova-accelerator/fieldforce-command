
import React from 'react';
import Layout from '../components/Layout';
import Scheduling from '../components/Scheduling';

const SchedulePage = () => {
  return (
    <Layout currentPage="schedule" onNavigate={() => {}}>
      <Scheduling />
    </Layout>
  );
};

export default SchedulePage;
