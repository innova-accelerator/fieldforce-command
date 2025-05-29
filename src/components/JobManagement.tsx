
import React, { useState } from 'react';
import { Search, Plus, Calendar, User, MapPin, Clock, Filter } from 'lucide-react';
import { mockJobs } from '../data/mockData';
import { Job } from '../types';

const JobManagement = () => {
  const [jobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const JobCard = ({ job }: { job: Job }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedJob(job)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{job.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)}`}>
            {job.status.replace('-', ' ')}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(job.priority)}`}>
            {job.priority}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          {job.customerName}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {job.location}
        </div>
        {job.assignedToName && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            Assigned to: {job.assignedToName}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {job.estimatedDuration}h estimated
        </div>
        {job.scheduledDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled: {job.scheduledDate.toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {job.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const JobDetailsModal = ({ job, onClose }: { job: Job; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-gray-900">{job.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{job.description}</p>
                </div>
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
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Priority</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(job.status)}`}>
                    {job.status.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimated Duration</label>
                  <p className="text-gray-900">{job.estimatedDuration} hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{job.createdAt.toLocaleDateString()}</p>
                </div>
                {job.scheduledDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Scheduled Date</label>
                    <p className="text-gray-900">{job.scheduledDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
        </div>
      )}

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

export default JobManagement;
