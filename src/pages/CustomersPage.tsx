
import React, { useState } from 'react';
import Layout from '../components/Layout';
import CustomerManagement from '../components/CustomerManagement';

const CustomersPage = () => {
  const [currentPage, setCurrentPage] = useState('customers');

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <CustomerManagement />
    </Layout>
  );
};

export default CustomersPage;
