import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, User } from 'lucide-react';
import { mockJobs, mockAssociates } from '../data/mockData';
import { Job } from '../types/job';
import { Associate } from '../types';

const Scheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const jobs = mockJobs.filter(job => job.scheduledDate);
  const associates = mockAssociates;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric',
      day: viewMode === 'day' ? 'numeric' : undefined
    });
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => 
      job.scheduledDate && 
      new Date(job.scheduledDate).toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-500';
      case 'in-progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const JobCard = ({ job, compact = false }: { job: Job; compact?: boolean }) => (
    <div 
      className={`${getStatusColor(job.status)} text-white p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity ${
        compact ? 'text-xs' : 'text-sm'
      }`}
      onClick={() => setSelectedJob(job)}
    >
      <div className="font-medium truncate">{job.name}</div>
      {!compact && (
        <>
          <div className="text-xs opacity-90 truncate">{job.customerName}</div>
          <div className="flex items-center text-xs opacity-90 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {job.estimatedDuration || 0}h
          </div>
        </>
      )}
    </div>
  );

  const WeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="grid grid-cols-8 gap-1 h-full">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-12 border-b border-gray-200"></div>
          {timeSlots.map(hour => (
            <div key={hour} className="h-12 border-b border-gray-200 text-xs text-gray-500 p-1">
              {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="col-span-1">
            <div className="h-12 border-b border-gray-200 p-2 text-center">
              <div className="text-sm font-medium text-gray-900">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {day.getDate()}
              </div>
            </div>
            <div className="relative">
              {timeSlots.map(hour => (
                <div key={hour} className="h-12 border-b border-gray-200 border-r border-gray-200 p-1">
                  {hour === 9 && getJobsForDate(day).map(job => (
                    <JobCard key={job.id} job={job} compact />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const MonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1 h-full">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayJobs = getJobsForDate(day);
          const isCurrentMonth = day.getMonth() === month;
          
          return (
            <div 
              key={index} 
              className={`min-h-24 p-1 border-b border-r border-gray-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {day.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {dayJobs.slice(0, 2).map(job => (
                  <JobCard key={job.id} job={job} compact />
                ))}
                {dayJobs.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayJobs.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DayView = () => {
    const dayJobs = getJobsForDate(currentDate);
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="grid grid-cols-4 gap-4 h-full">
        <div className="col-span-3">
          <div className="space-y-1">
            {timeSlots.map(hour => (
              <div key={hour} className="flex border-b border-gray-200">
                <div className="w-20 p-2 text-sm text-gray-500">
                  {hour === 0 ? '12 AM' : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
                </div>
                <div className="flex-1 p-2 min-h-12">
                  {hour === 9 && dayJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Available Associates</h3>
          <div className="space-y-2">
            {associates.filter(a => a.availability === 'available').map(associate => (
              <div key={associate.id} className="bg-white p-3 rounded border">
                <div className="font-medium text-sm">{associate.name}</div>
                <div className="text-xs text-gray-600 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {associate.location.address}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {associate.skills.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const JobDetailsModal = ({ job, onClose }: { job: Job; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{job.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Customer</label>
            <p className="text-gray-900">{job.customerName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Location</label>
            <p className="text-gray-900">{job.location}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Assigned To</label>
            <p className="text-gray-900">{job.assignedToName || 'Unassigned'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Scheduled</label>
            <p className="text-gray-900">{job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Not scheduled'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Duration</label>
            <p className="text-gray-900">{job.estimatedDuration || 0} hours</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium text-gray-900 min-w-48 text-center">
              {formatDate(currentDate)}
            </span>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === 'month' && <MonthView />}
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'day' && <DayView />}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default Scheduling;
