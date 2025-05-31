
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, UserCheck, Settings, Home, Building2, User, Briefcase, LogIn } from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: 'Dashboard',
      description: 'Get an overview of your business metrics and recent activities',
      icon: Home,
      href: '/dashboard'
    },
    {
      title: 'Organizations',
      description: 'Manage your business partners and vendors',
      icon: Building2,
      href: '/organizations'
    },
    {
      title: 'People',
      description: 'Keep track of contacts and team members',
      icon: User,
      href: '/people'
    },
    {
      title: 'Jobs',
      description: 'Create, manage, and track all your field service jobs',
      icon: Briefcase,
      href: '/jobs'
    },
    {
      title: 'Customers',
      description: 'Manage your customer database and relationships',
      icon: Users,
      href: '/customers'
    },
    {
      title: 'Associates',
      description: 'Coordinate with your field service team',
      icon: UserCheck,
      href: '/associates'
    },
    {
      title: 'Schedule',
      description: 'Plan and organize your field service operations',
      icon: Calendar,
      href: '/schedule'
    },
    {
      title: 'Settings',
      description: 'Configure your application preferences',
      icon: Settings,
      href: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">FF</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            FieldForce
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline your field service operations with our comprehensive management platform. 
            Manage jobs, track teams, and deliver exceptional customer service.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign In / Sign Up
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Built with React, TypeScript, and Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
