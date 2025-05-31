
import React from 'react';
import Layout from '../components/Layout';
import CustomerManagement from '../components/CustomerManagement';

const CustomersPage = () => {
  return (
    <Layout currentPage="customers" onNavigate={() => {}}>
      <CustomerManagement />
    </Layout>
  );
};

export default CustomersPage;
