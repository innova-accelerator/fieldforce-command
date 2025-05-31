import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Job } from '../../../types/job';

interface KeyDataSectionsProps {
  job: Job;
}

const KeyDataSections: React.FC<KeyDataSectionsProps> = ({ job }) => {
  return (
    <div className="space-y-4">
      
      {/* Site Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Site Address</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">{job.location}</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">View Map</Button>
            <Button size="sm" variant="outline">Edit Address</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Start
            </label>
            <div className="flex gap-2">
              <input 
                type="date" 
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                defaultValue={job.scheduledDate?.toISOString().split('T')[0]}
              />
              <Button size="sm" variant="outline">Set Now</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected End
            </label>
            <div className="flex gap-2">
              <input 
                type="date" 
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <Button size="sm" variant="outline">Set Now</Button>
            </div>
          </div>
          <Button size="sm" className="w-full">Confirm</Button>
        </CardContent>
      </Card>
      
      {/* Techs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assigned Techs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{job.assignedToName}</span>
              <Button size="sm" variant="ghost">Remove</Button>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full">Add Tech</Button>
        </CardContent>
      </Card>
      
      {/* Costs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Costs & Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Planned Hours:</span>
              <span>{job.estimatedDuration}h</span>
            </div>
            <div className="flex justify-between">
              <span>Income:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Labor:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Material:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total:</span>
              <span>$0.00</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full mt-3">Add Hours</Button>
        </CardContent>
      </Card>
      
      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admin Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="destructive" size="sm" className="w-full">Delete Job</Button>
          <Button variant="outline" size="sm" className="w-full text-yellow-600 border-yellow-300">
            Archive Job
          </Button>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default KeyDataSections;
