import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Job } from '../../../types/job';

interface JobDetailsTabsProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
}

const JobDetailsTabs: React.FC<JobDetailsTabsProps> = ({ job, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [description, setDescription] = useState(job.description || '');

  const updateDescription = () => {
    onUpdate({ description });
  };

  const updateSchedule = (field: 'start_date' | 'end_date', value: string) => {
    onUpdate({ [field]: value });
  };

  const updateTechs = () => {
    // For now, just using existing techs - would need more complex logic for real implementation
    const currentTechs = job.assigned_techs || [];
    onUpdate({ assigned_techs: currentTechs });
  };

  const updateContact = (field: 'contact_name' | 'contact_phone' | 'contact_email', value: string) => {
    onUpdate({ [field]: value });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">Schedule</TabsTrigger>
            <TabsTrigger value="team" className="text-xs sm:text-sm">Team</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          </TabsList>
          
          <div className="p-4 sm:p-6">
            <TabsContent value="details" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      className="mt-1"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onBlur={updateDescription}
                      placeholder="Enter project description..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location"
                      className="mt-1"
                      value={job.location || ''}
                      onChange={(e) => onUpdate({ location: e.target.value })}
                      placeholder="Project location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phase">Phase</Label>
                    <Input 
                      id="phase"
                      className="mt-1"
                      value={job.phase || ''}
                      onChange={(e) => onUpdate({ phase: e.target.value })}
                      placeholder="Project phase"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Schedule Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input 
                      id="startDate"
                      type="date"
                      className="mt-1"
                      value={job.start_date ? new Date(job.start_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateSchedule('start_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input 
                      id="endDate"
                      type="date"
                      className="mt-1"
                      value={job.end_date ? new Date(job.end_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateSchedule('end_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                    <Input 
                      id="estimatedDuration"
                      type="number"
                      className="mt-1"
                      value={job.estimated_duration || ''}
                      onChange={(e) => onUpdate({ estimated_duration: parseInt(e.target.value) || undefined })}
                      placeholder="Hours"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Assigned Team</h3>
                <div className="space-y-3">
                  {job.assigned_techs.map((techId) => (
                    <div key={techId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {`T${techId.slice(-1)}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Tech {techId}</div>
                        <div className="text-sm text-gray-500">tech{techId}@company.com</div>
                      </div>
                    </div>
                  ))}
                  {job.assigned_techs.length === 0 && (
                    <p className="text-gray-500">No team members assigned</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input 
                      id="contactName"
                      className="mt-1"
                      value={job.contact_name || ''}
                      onChange={(e) => updateContact('contact_name', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input 
                      id="contactPhone"
                      className="mt-1"
                      value={job.contact_phone || ''}
                      onChange={(e) => updateContact('contact_phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input 
                      id="contactEmail"
                      type="email"
                      className="mt-1"
                      value={job.contact_email || ''}
                      onChange={(e) => updateContact('contact_email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JobDetailsTabs;
