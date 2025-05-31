
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import CustomerManagement from '../components/CustomerManagement';
import AssociateDirectory from '../components/AssociateDirectory';
import Scheduling from '../components/Scheduling';
import Settings from '../components/Settings';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Building, 
  UserCheck,
  Settings as SettingsIcon
} from 'lucide-react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const features = [
    {
      title: 'Dashboard',
      description: 'Overview of your business metrics and activities',
      icon: BarChart3,
      path: '/dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'Jobs',
      description: 'Manage and track all your field service jobs',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-green-500'
    },
    {
      title: 'Customers',
      description: 'Customer relationship management',
      icon: Users,
      path: '/customers',
      color: 'bg-purple-500'
    },
    {
      title: 'Organizations',
      description: 'Manage client and partner organizations',
      icon: Building,
      path: '/organizations',
      color: 'bg-orange-500'
    },
    {
      title: 'People',
      description: 'Contact management for individuals',
      icon: UserCheck,
      path: '/people',
      color: 'bg-indigo-500'
    },
    {
      title: 'Associates',
      description: 'Field technician directory and management',
      icon: UserCheck,
      path: '/associates',
      color: 'bg-teal-500'
    },
    {
      title: 'Schedule',
      description: 'Job scheduling and calendar management',
      icon: Calendar,
      path: '/schedule',
      color: 'bg-red-500'
    },
    {
      title: 'Settings',
      description: 'Application configuration and preferences',
      icon: SettingsIcon,
      path: '/settings',
      color: 'bg-gray-500'
    }
  ];

  const renderPageContent = () => {
    if (currentPage === 'dashboard') {
      return <Dashboard />;
    }
    if (currentPage === 'customers') {
      return <CustomerManagement />;
    }
    if (currentPage === 'associates') {
      return <AssociateDirectory />;
    }
    if (currentPage === 'schedule') {
      return <Scheduling />;
    }
    if (currentPage === 'settings') {
      return <Settings />;
    }
    
    // Default landing page for other pages or initial load
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Field Force Management
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solution for managing field service operations, 
              customer relationships, and workforce scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link 
                  key={feature.path} 
                  to={feature.path}
                  className="group"
                  aria-label={`Navigate to ${feature.title}`}
                >
                  <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-200">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Demo link to job overview */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Job Overview Demo</h3>
              <p className="text-sm text-blue-700 mb-4">
                Experience the responsive Job Overview workspace with real-time updates, 
                task management, and timeline tracking.
              </p>
              <Link to="/jobs/demo-job-123/overview">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View Job Overview Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPageContent()}
    </Layout>
  );
};

export default Index;
