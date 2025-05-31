
import React from 'react';
import Layout from '../components/Layout';
import AssociateDirectory from '../components/AssociateDirectory';

const AssociatesPage = () => {
  return (
    <Layout currentPage="associates" onNavigate={() => {}}>
      <AssociateDirectory />
    </Layout>
  );
};

export default AssociatesPage;
