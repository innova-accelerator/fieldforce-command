
import React from 'react';
import { Star, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Job } from '../../../types/job';

interface JobHeaderProps {
  job: Job;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  return (
    <div className="bg-card rounded-lg shadow-sm dark:shadow-none border border-border p-4 sm:p-6">
      {/* Breadcrumb - responsive text */}
      <nav className="text-xs sm:text-sm text-muted-foreground mb-2">
        Jobs &gt; {job.customerName} &gt; Overview
      </nav>
      
      {/* Main header content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
              {job.name}
            </h1>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span>Client: {job.customerName}</span>
            <span className="hidden sm:inline">•</span>
            <span>Phase: {job.status}</span>
            <span className="hidden sm:inline">•</span>
            <span>Assigned: {job.assignedPersonName || 'Unassigned'}</span>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            job.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
            job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {job.priority} priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
