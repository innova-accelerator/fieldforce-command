
import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Mail } from 'lucide-react';
import { mockJobs } from '../data/mockData';
import { useAssociates } from '../hooks/useData';

const Scheduling = () => {
  const [jobs] = useState(mockJobs);
  const { data: associates = [] } = useAssociates();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const scheduledJobs = jobs.filter(job => 
    job.scheduled_date && new Date(job.scheduled_date).toDateString() === selectedDate.toDateString()
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'Scheduled': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'In Progress': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const JobCard = ({ job }: { job: any }) => (
    <div 
      className={`bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-4 cursor-pointer transition-all hover:shadow-md dark:hover:bg-[#303030] ${
        selectedJob === job.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
      }`}
      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{job.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{job.customerName}</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          {job.scheduled_date && (
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {formatTime(job.scheduled_date)}
            </span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{job.estimated_duration || 0}h estimated duration</span>
        </div>

        {job.assigned_person_id && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Assigned to team member</span>
          </div>
        )}
      </div>

      {selectedJob === job.id && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#303030] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Contact Information</h4>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-3 w-3 mr-2" />
                  {job.contact_name}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-3 w-3 mr-2" />
                  <a href={`tel:${job.contact_phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {job.contact_phone}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-3 w-3 mr-2" />
                  <a href={`mailto:${job.contact_email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {job.contact_email}
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Schedule Details</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div>Start: {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'Not set'}</div>
                <div>End: {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Not set'}</div>
                <div>Duration: {job.estimated_duration || 0} hours</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <button className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              Edit Schedule
            </button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-[#303030] text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              View Details
            </button>
            <button className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white text-sm rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
              Mark Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const jobsOnDay = jobs.filter(job => 
        job.scheduled_date && new Date(job.scheduled_date).toDateString() === date.toDateString()
      );
      days.push({ date, jobsCount: jobsOnDay.length });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-background dark:bg-[#171717] min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Schedule Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage job schedules and assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(day.date)}
                className={`
                  aspect-square flex flex-col items-center justify-center text-sm relative
                  ${!day ? 'invisible' : ''}
                  ${day && day.date.toDateString() === selectedDate.toDateString() 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-[#303030] text-gray-700 dark:text-gray-300'
                  }
                  ${day && day.date.toDateString() === today.toDateString() 
                    ? 'ring-2 ring-blue-200 dark:ring-blue-400' 
                    : ''
                  }
                  rounded transition-colors
                `}
              >
                {day && (
                  <>
                    <span>{day.date.getDate()}</span>
                    {day.jobsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {day.jobsCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Jobs for Selected Date */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Jobs for {formatDate(selectedDate)}
            </h2>
            
            {scheduledJobs.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No jobs scheduled for this date</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Schedule a Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Jobs</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {jobs.filter(job => 
                  job.scheduled_date && new Date(job.scheduled_date).toDateString() === today.toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {jobs.filter(job => {
                  if (!job.scheduled_date) return false;
                  const jobDate = new Date(job.scheduled_date);
                  const weekStart = new Date(today);
                  weekStart.setDate(today.getDate() - today.getDay());
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6);
                  return jobDate >= weekStart && jobDate <= weekEnd;
                }).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Techs</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{associates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Locations</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Set(jobs.map(job => job.location)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
