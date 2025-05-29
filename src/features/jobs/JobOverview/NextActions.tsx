
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Job } from '../../../types';

interface NextActionsProps {
  job: Job;
}

const NextActions: React.FC<NextActionsProps> = ({ job }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Next Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Last meeting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Meeting
            </label>
            <Input type="date" className="w-full" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input type="datetime-local" className="w-full" />
          </div>
        </div>
        
        {/* Next action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Action
          </label>
          <Input 
            placeholder="Describe next action..." 
            className="w-full"
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Additional details..."
          />
        </div>
        
        {/* Hibernate date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hibernate Date
            </label>
            <Input type="date" className="w-full" />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm">Save Changes</Button>
          <Button size="sm" variant="outline">Clear</Button>
        </div>
        
      </CardContent>
    </Card>
  );
};

export default NextActions;
