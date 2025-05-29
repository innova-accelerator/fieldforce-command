
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Job } from '../../../types';
import { cn } from '../../../lib/utils';

interface QuickEditToolbarProps {
  job: Job;
  className?: string;
}

const QuickEditToolbar: React.FC<QuickEditToolbarProps> = ({ job, className }) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border p-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Color picker */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Color:</label>
          <div className="w-8 h-8 bg-blue-500 rounded border cursor-pointer"></div>
        </div>
        
        {/* Job ID */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Job ID:</label>
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            #{job.id}
          </span>
        </div>
        
        {/* LPN Input */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">LPN:</label>
          <Input 
            placeholder="Add LPN" 
            className="h-8 text-sm flex-1 min-w-0"
          />
        </div>
        
        {/* PO Input */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">PO:</label>
          <Input 
            placeholder="Add PO" 
            className="h-8 text-sm flex-1 min-w-0"
          />
        </div>
        
      </div>
      
      {/* Action buttons - responsive layout */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
        <Button size="sm" variant="outline">Take Note</Button>
        <Button size="sm" variant="outline">Set Meeting</Button>
        <Button size="sm" variant="outline">To P-Drive</Button>
        <Button size="sm" variant="outline">Request Site Visit</Button>
      </div>
    </div>
  );
};

export default QuickEditToolbar;
