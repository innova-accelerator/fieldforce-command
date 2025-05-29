
import React from 'react';
import { Users, Calendar, UserCheck, Settings, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: Home },
    { name: 'Customers', href: 'customers', icon: Users },
    { name: 'Jobs', href: 'jobs', icon: Calendar },
    { name: 'Associates', href: 'associates', icon: UserCheck },
    { name: 'Schedule', href: 'schedule', icon: Calendar },
    { name: 'Settings', href: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-900">FieldForce</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = currentPage === item.href;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:static">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600 mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {currentPage.replace('-', ' ')}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back, Admin
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
