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

  const copyJobId = async () => {
    try {
      await navigator.clipboard.writeText(job.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy job ID:', err);
    }
  };

  const toggleFavorite = () => {
    onUpdate({ isFavorite: !job.isFavorite });
  };

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-3">
        Dashboard &gt; Jobs &gt; {job.name}
      </nav>
      
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
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
                  job.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                }`} 
              />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Edit className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(job.phase)}`}>
              {job.phase}
            </span>
            
            <button
              onClick={copyJobId}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>ID: {job.id}</span>
              <Copy className="h-3 w-3" />
              {copied && <span className="text-green-600 text-xs">Copied!</span>}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <span>Assigned: {job.assignedTechs.map(techId => `Tech ${techId}`).join(', ') || 'Unassigned'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHeader;
