
import React from 'react';
import { Users, Calendar, UserCheck, Settings, Home, Menu, X, Building2, User, Briefcase, Map, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ui/theme-toggle';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: Home },
    { name: 'Organizations', href: 'organizations', icon: Building2 },
    { name: 'Customers', href: 'customers', icon: Users, isSubItem: true },
    { name: 'Associates', href: 'associates', icon: UserCheck, isSubItem: true },
    { name: 'People', href: 'people', icon: User },
    { name: 'Jobs', href: 'jobs', icon: Briefcase },
    { name: 'Task Engine', href: 'task-engine', icon: CheckSquare },
    { name: 'Map', href: 'map', icon: Map },
    { name: 'Schedule', href: 'schedule', icon: Calendar },
    { name: 'Settings', href: 'settings', icon: Settings },
  ];

  const handleNavigation = (href: string) => {
    if (href === 'task-engine') {
      // For now, navigate to a default job ID - in a real app, this would be dynamic
      navigate('/task-engine/sample-job-id');
    } else {
      navigate(`/${href}`);
    }
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">FieldForce</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
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
                onClick={() => handleNavigation(item.href)}
                className={`
                  w-full flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors duration-200
                  ${item.isSubItem ? 'ml-4 pl-6' : ''}
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
        <header className="bg-card shadow-sm border-b border-border lg:static">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-semibold text-foreground capitalize">
                {currentPage.replace('-', ' ')}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  Welcome back, {user?.email?.split('@')[0] || 'User'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
