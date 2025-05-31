
import React from 'react';
import { Calendar, Users, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Active Jobs', value: '24', icon: CheckCircle, change: '+12%', changeType: 'positive' },
    { name: 'Pending Tasks', value: '18', icon: Clock, change: '+4%', changeType: 'positive' },
    { name: 'Team Members', value: '12', icon: Users, change: '0%', changeType: 'neutral' },
    { name: 'Revenue', value: '$45,230', icon: TrendingUp, change: '+8%', changeType: 'positive' },
  ];

  const recentJobs = [
    { id: 1, name: 'HVAC Maintenance', customer: 'Tech Solutions Inc.', status: 'In Progress', priority: 'High' },
    { id: 2, name: 'Network Setup', customer: 'Green Energy Corp.', status: 'Scheduled', priority: 'Medium' },
    { id: 3, name: 'Security System Install', customer: 'Retail Plus', status: 'Completed', priority: 'Low' },
    { id: 4, name: 'Plumbing Repair', customer: 'Office Center', status: 'New', priority: 'Urgent' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'In Progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Scheduled': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'New': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 bg-background dark:bg-[#171717] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <span className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 
                    stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Jobs</h2>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#303030] rounded-lg border dark:border-gray-600">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{job.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.customer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                    {job.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border dark:border-blue-700">
              <CheckCircle className="h-5 w-5 mr-3" />
              Create New Job
            </button>
            <button className="w-full flex items-center p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border dark:border-green-700">
              <Users className="h-5 w-5 mr-3" />
              Add Team Member
            </button>
            <button className="w-full flex items-center p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border dark:border-purple-700">
              <Calendar className="h-5 w-5 mr-3" />
              Schedule Appointment
            </button>
            <button className="w-full flex items-center p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors border dark:border-orange-700">
              <AlertTriangle className="h-5 w-5 mr-3" />
              View Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
