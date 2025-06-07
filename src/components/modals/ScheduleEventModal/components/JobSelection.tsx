
import React from 'react';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';

interface JobSelectionProps {
  activeJobs: any[];
  selectedJobId: string;
  onJobSelect: (jobId: string) => void;
}

export const JobSelection: React.FC<JobSelectionProps> = ({
  activeJobs,
  selectedJobId,
  onJobSelect
}) => {
  return (
    <div>
      <Label htmlFor="jobSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
        Select Job
      </Label>
      <Select value={selectedJobId} onValueChange={onJobSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose an active job..." />
        </SelectTrigger>
        <SelectContent>
          {activeJobs.map((job) => (
            <SelectItem key={job.id} value={job.id}>
              <div className="flex flex-col">
                <span className="font-medium">{job.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{job.customerName} - {job.status}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
