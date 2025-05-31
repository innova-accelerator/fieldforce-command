
import React, { useState } from 'react';
import Layout from '../components/Layout';
import AssociateDirectory from '../components/AssociateDirectory';

const AssociatesPage = () => {
  const [currentPage, setCurrentPage] = useState('associates');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <AssociateDirectory />
    </Layout>
  );
};

export default AssociatesPage;
