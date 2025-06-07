
import React, { useState } from 'react';
import { Star, Edit, Copy } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Job } from '../../../types/job';

interface JobHeaderProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
}

const JobHeader: React.FC<JobHeaderProps> = ({ job, onUpdate }) => {
  const [copied, setCopied] = useState(false);

  // Debug logging to see what we're getting
  console.log('JobHeader - job object:', job);
  console.log('JobHeader - job.job_number:', job.job_number);
  console.log('JobHeader - job.id:', job.id);

  const copyJobNumber = async () => {
    try {
      const jobNumber = job.job_number || `Job ${job.id.slice(0, 8)}`;
      await navigator.clipboard.writeText(jobNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy job number:', err);
    }
  };

  const toggleFavorite = () => {
    onUpdate({ is_favorite: !job.is_favorite });
  };

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'proposal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Display job number or fallback
  const displayJobNumber = job.job_number || `Job ${job.id.slice(0, 8)}`;

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-muted-foreground mb-3">
        Dashboard &gt; Jobs &gt; {displayJobNumber}
      </nav>
      
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
              {job.name} – {job.customerName}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="flex-shrink-0"
            >
              <Star 
                className={`h-5 w-5 ${
                  job.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                }`} 
              />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Edit className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(job.phase)}`}>
              {job.phase}
            </span>
            
            <button
              onClick={copyJobNumber}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span className="font-mono">#{displayJobNumber}</span>
              <Copy className="h-3 w-3" />
              {copied && <span className="text-green-600 text-xs">Copied!</span>}
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span>Assigned: {job.assigned_techs.map(techId => `Tech ${techId}`).join(', ') || 'Unassigned'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
