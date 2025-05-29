
import React from 'react';
import { useJob } from '../../hooks/useJob';
import JobHeader from './JobOverview/JobHeader';
import QuickEditToolbar from './JobOverview/QuickEditToolbar';
import NextActions from './JobOverview/NextActions';
import KeyDataSections from './JobOverview/KeyDataSections';
import DetailTabs from './JobOverview/DetailTabs';
import HistoryFeed from './JobOverview/HistoryFeed';

interface JobOverviewPageProps {
  jobId: string;
}

const JobOverviewPage: React.FC<JobOverviewPageProps> = ({ jobId }) => {
  const { data: job, isLoading, error } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Failed to load job details</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first responsive container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Job Header - always at top */}
        <JobHeader job={job} />
        
        {/* Quick Edit Toolbar - responsive */}
        <QuickEditToolbar job={job} className="mt-4" />
        
        {/* Main content area - responsive grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Next Actions - full width on mobile, spans on desktop */}
          <div className="lg:col-span-8">
            <NextActions job={job} />
          </div>
          
          {/* Key Data Sections - stacked on mobile, sidebar on desktop */}
          <div className="lg:col-span-4 space-y-6">
            <KeyDataSections job={job} />
          </div>
          
          {/* Detail Tabs - full width on all screens */}
          <div className="lg:col-span-8">
            <DetailTabs job={job} />
          </div>
          
          {/* History Feed - full width on mobile, sidebar continuation on desktop */}
          <div className="lg:col-span-4">
            <HistoryFeed jobId={jobId} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default JobOverviewPage;
