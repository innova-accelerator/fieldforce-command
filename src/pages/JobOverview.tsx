
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import JobOverviewPage from '../features/jobs/JobOverviewPage';

const JobOverview = () => {
  const { jobId } = useParams<{ jobId: string }>();

  if (!jobId) {
    return <div>Job ID not found</div>;
  }

  return (
    <Layout currentPage="jobs" onNavigate={() => {}}>
      <JobOverviewPage jobId={jobId} />
    </Layout>
  );
};

export default JobOverview;
