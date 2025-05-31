import React from 'react';
import { MapPin, Phone, Mail, Calendar, Users, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Job } from '../../../types/job';

interface JobSidebarProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job }) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const completedTasks = job.tasks ? job.tasks.filter(task => task.complete).length : 0;
  const totalTasks = job.tasks ? job.tasks.length : 0;

  return (
    <div className="space-y-4">
      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-medium text-gray-900">{job.contact_name}</div>
            <div className="text-sm text-gray-600">{job.customerName}</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <a href={`tel:${job.contact_phone}`} className="text-blue-600 hover:underline">
              {job.contact_phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <a href={`mailto:${job.contact_email}`} className="text-blue-600 hover:underline">
              {job.contact_email}
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700">
            {job.location}
          </div>
          <button className="mt-2 text-sm text-blue-600 hover:underline">
            View on map
          </button>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-900">Start Date</div>
            <div className="text-sm text-gray-600">{job.start_date ? formatDate(job.start_date) : 'Not set'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">End Date</div>
            <div className="text-sm text-gray-600">{job.end_date ? formatDate(job.end_date) : 'Not set'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Team */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assigned Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {job.assigned_techs.map((techId) => (
              <div key={techId} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {`T${techId.slice(-1)}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900">Tech {techId}</div>
                  <div className="text-xs text-gray-500">tech{techId}@company.com</div>
                </div>
              </div>
            ))}
            {job.assigned_techs.length === 0 && (
              <div className="text-sm text-gray-500">No team members assigned</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks Completed</span>
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% complete
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSidebar;
