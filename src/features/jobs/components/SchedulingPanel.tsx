
import React, { useState } from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Job, TimelineEntry } from '../../../types/job';
import { usePeople } from '../../../hooks/useData';

interface SchedulingPanelProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
  onTimelineUpdate: (entry: Omit<TimelineEntry, 'timestamp' | 'id' | 'job_id' | 'created_at'>) => void;
}

const SchedulingPanel: React.FC<SchedulingPanelProps> = ({ 
  job, 
  onUpdate, 
  onTimelineUpdate 
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const { data: people = [] } = usePeople();

  // Filter people who are technicians
  const availableTechnicians = people.filter(person => person.is_technician);

  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const updateDate = (field: 'start_date' | 'end_date', value: string) => {
    onUpdate({ [field]: value });
    onTimelineUpdate({
      type: 'scheduling',
      content: `${field === 'start_date' ? 'Start' : 'End'} date updated to ${value ? new Date(value).toLocaleDateString() : 'not set'}`,
      author_id: undefined // Should be set to current user's person ID
    });
  };

  const assignTech = (personId: string) => {
    if (!job.assigned_techs.find(techId => techId === personId)) {
      const updatedTechs = [...job.assigned_techs, personId];
      const person = people.find(p => p.id === personId);
      onUpdate({ assigned_techs: updatedTechs });
      onTimelineUpdate({
        type: 'assignment',
        content: `${person?.first_name} ${person?.last_name} assigned to job`,
        author_id: undefined // Should be set to current user's person ID
      });
    }
    setShowAssignModal(false);
  };

  const removeTech = (techId: string) => {
    const updatedTechs = job.assigned_techs.filter(id => id !== techId);
    const person = people.find(p => p.id === techId);
    onUpdate({ assigned_techs: updatedTechs });
    onTimelineUpdate({
      type: 'assignment',
      content: `${person?.first_name} ${person?.last_name} removed from job`,
      author_id: undefined // Should be set to current user's person ID
    });
  };

  const getTechName = (techId: string) => {
    const person = people.find(p => p.id === techId);
    return person ? `${person.first_name} ${person.last_name}` : `Tech ${techId}`;
  };

  const getTechInitials = (techId: string) => {
    const person = people.find(p => p.id === techId);
    return person ? `${person.first_name[0]}${person.last_name[0]}` : techId.slice(-2).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Scheduling</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Date Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formatDateForInput(job.start_date)}
              onChange={(e) => updateDate('start_date', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formatDateForInput(job.end_date)}
              onChange={(e) => updateDate('end_date', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Assigned Techs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Assigned Techs & Subcontractors
            </Label>
            <Button
              size="sm"
              onClick={() => setShowAssignModal(true)}
              className="h-8 px-3"
              disabled={availableTechnicians.length === 0}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {job.assigned_techs.map((techId) => (
              <div key={techId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {getTechInitials(techId)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{getTechName(techId)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTech(techId)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  ×
                </Button>
              </div>
            ))}
            
            {job.assigned_techs.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No techs assigned</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-none border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assign Tech/Subcontractor</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAssignModal(false)}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2">
              {availableTechnicians.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No technicians available. Please add people with technician role first.
                </p>
              ) : (
                availableTechnicians.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => assignTech(person.id)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={job.assigned_techs.includes(person.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        {person.first_name[0]}{person.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {person.first_name} {person.last_name}
                      </span>
                      {person.title && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{person.title}</p>
                      )}
                    </div>
                    {job.assigned_techs.includes(person.id) && (
                      <span className="text-xs text-green-600 dark:text-green-400">Assigned</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingPanel;
