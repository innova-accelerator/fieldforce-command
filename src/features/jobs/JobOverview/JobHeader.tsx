import React from 'react';
import { Star, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Job } from '../../../types';

interface JobHeaderProps {
  job: Job;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      {/* Breadcrumb - responsive text */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-2">
        Jobs &gt; {job.customerName} &gt; Overview
      </nav>
      
      {/* Main header content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {job.title}
            </h1>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
            <span>Client: {job.customerName}</span>
            <span className="hidden sm:inline">•</span>
            <span>Phase: {job.status}</span>
            <span className="hidden sm:inline">•</span>
            <span>Assigned: {job.assignedToName}</span>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            job.priority === 'high' ? 'bg-red-100 text-red-800' :
            job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {job.priority} priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
