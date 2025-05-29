
import React from 'react';
import { useParams } from 'react-router-dom';
import JobOverviewPage from '../features/jobs/JobOverviewPage';

const JobOverview = () => {
  const { jobId } = useParams<{ jobId: string }>();

  if (!jobId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Job ID not found</div>
      </div>
    );
  }

  return <JobOverviewPage />;
};

export default JobOverview;
