
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Scheduling from '../components/Scheduling';

const SchedulePage = () => {
  const [currentPage, setCurrentPage] = useState('schedule');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <Scheduling />
    </Layout>
  );
};

export default SchedulePage;
