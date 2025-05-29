
import React, { useState } from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Job, Associate, TimelineEntry } from '../../../types/job';

interface SchedulingPanelProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
  onTimelineUpdate: (entry: Omit<TimelineEntry, 'timestamp'>) => void;
}

// Mock available associates - in real app, fetch from API
const availableAssociates: Associate[] = [
  { id: 'tech-3', name: 'Mike Davis', avatarUrl: '/placeholder.svg' },
  { id: 'tech-4', name: 'Lisa Chen', avatarUrl: '/placeholder.svg' },
  { id: 'tech-5', name: 'David Brown', avatarUrl: '/placeholder.svg' }
];

const SchedulingPanel: React.FC<SchedulingPanelProps> = ({ 
  job, 
  onUpdate, 
  onTimelineUpdate 
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);

  const updateDate = (field: 'startDate' | 'endDate', value: string) => {
    onUpdate({ [field]: value });
    onTimelineUpdate({
      type: 'scheduling',
      content: `${field === 'startDate' ? 'Start' : 'End'} date updated to ${new Date(value).toLocaleDateString()}`,
      author: 'Current User'
    });
  };

  const assignTech = (associate: Associate) => {
    if (!job.assignedTechs.find(tech => tech.id === associate.id)) {
      const updatedTechs = [...job.assignedTechs, associate];
      onUpdate({ assignedTechs: updatedTechs });
      onTimelineUpdate({
        type: 'assignment',
        content: `${associate.name} assigned to job`,
        author: 'Current User'
      });
    }
    setShowAssignModal(false);
  };

  const removeTech = (techId: string) => {
    const tech = job.assignedTechs.find(t => t.id === techId);
    const updatedTechs = job.assignedTechs.filter(tech => tech.id !== techId);
    onUpdate({ assignedTechs: updatedTechs });
    if (tech) {
      onTimelineUpdate({
        type: 'assignment',
        content: `${tech.name} removed from job`,
        author: 'Current User'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Scheduling</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Date Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
              Expected Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={job.startDate}
              onChange={(e) => updateDate('startDate', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
              Expected End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={job.endDate}
              onChange={(e) => updateDate('endDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Assigned Techs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-700">
              Assigned Techs & Subcontractors
            </Label>
            <Button
              size="sm"
              onClick={() => setShowAssignModal(true)}
              className="h-8 px-3"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {job.assignedTechs.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={tech.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTech(tech.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            ))}
            
            {job.assignedTechs.length === 0 && (
              <p className="text-sm text-gray-500 italic">No techs assigned</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
        <Button size="sm" variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Set Now
        </Button>
        <Button size="sm" variant="outline">
          View Calendar
        </Button>
        <Button size="sm" variant="outline">
          Reschedule
        </Button>
      </div>
      
      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assign Tech/Subcontractor</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAssignModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2">
              {availableAssociates.map((associate) => (
                <button
                  key={associate.id}
                  onClick={() => assignTech(associate)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={associate.avatarUrl} />
                    <AvatarFallback>
                      {associate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{associate.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingPanel;
