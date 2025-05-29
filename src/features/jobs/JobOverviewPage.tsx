
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import JobHeader from './components/JobHeader';
import SchedulingPanel from './components/SchedulingPanel';
import Checklist from './components/Checklist';
import NotesSection from './components/NotesSection';
import TimelineFeed from './components/TimelineFeed';
import JobDetailsTabs from './components/JobDetailsTabs';
import { Job, Task, TimelineEntry, Associate } from '../../types/job';

// Mock data - easily replaceable with API calls
const mockJob: Job = {
  id: 'job-123',
  title: 'HVAC System Installation',
  client: 'ABC Corporation',
  phase: 'In Progress',
  startDate: '2024-01-15',
  endDate: '2024-01-30',
  assignedTechs: [
    { id: 'tech-1', name: 'John Smith', avatarUrl: '/placeholder.svg' },
    { id: 'tech-2', name: 'Sarah Johnson', avatarUrl: '/placeholder.svg' }
  ],
  tasks: [
    { id: 'task-1', label: 'Site survey completed', complete: true, dueDate: '2024-01-10' },
    { id: 'task-2', label: 'Equipment procurement', complete: true, dueDate: '2024-01-12' },
    { id: 'task-3', label: 'Installation phase 1', complete: false, dueDate: '2024-01-16' },
    { id: 'task-4', label: 'System testing', complete: false, dueDate: '2024-01-25' }
  ],
  notes: [
    'Initial assessment completed - all requirements confirmed',
    'Client requested additional ventilation in conference room',
    'Equipment delivery scheduled for January 14th'
  ],
  timeline: [
    { 
      timestamp: '2024-01-15T10:30:00Z', 
      type: 'status', 
      content: 'Job status changed to In Progress',
      author: 'John Smith'
    },
    { 
      timestamp: '2024-01-14T15:45:00Z', 
      type: 'note', 
      content: 'Equipment delivery confirmed for tomorrow morning',
      author: 'Sarah Johnson'
    },
    { 
      timestamp: '2024-01-14T09:20:00Z', 
      type: 'assignment', 
      content: 'Sarah Johnson assigned to installation team',
      author: 'Project Manager'
    },
    { 
      timestamp: '2024-01-12T14:15:00Z', 
      type: 'note', 
      content: 'Site survey completed. Ready for equipment procurement.',
      author: 'John Smith'
    },
    { 
      timestamp: '2024-01-10T11:30:00Z', 
      type: 'status', 
      content: 'Job created and assigned to team',
      author: 'Admin'
    }
  ],
  location: '123 Business Ave, Suite 100, City, State 12345',
  description: 'Complete HVAC system installation for commercial building including ductwork, units, and controls.',
  contactInfo: {
    name: 'Mike Wilson',
    phone: '(555) 123-4567',
    email: 'mike.wilson@abccorp.com'
  }
};

const JobOverviewPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job>(mockJob);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchJob = async () => {
      setLoading(true);
      // In real implementation: const response = await getJobById(jobId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setJob({ ...mockJob, id: jobId || 'job-123' });
      setLoading(false);
    };

    fetchJob();
  }, [jobId]);

  const updateJob = (updates: Partial<Job>) => {
    setJob(prev => ({ ...prev, ...updates }));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };
    setJob(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setJob(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  const addNote = (content: string) => {
    const newEntry: TimelineEntry = {
      timestamp: new Date().toISOString(),
      type: 'note',
      content,
      author: 'Current User'
    };
    
    setJob(prev => ({
      ...prev,
      notes: [...prev.notes, content],
      timeline: [newEntry, ...prev.timeline]
    }));
  };

  const addTimelineEntry = (entry: Omit<TimelineEntry, 'timestamp'>) => {
    const newEntry: TimelineEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    setJob(prev => ({
      ...prev,
      timeline: [newEntry, ...prev.timeline]
    }));
  };

  if (loading) {
    return (
      <Layout currentPage="jobs" onNavigate={() => {}}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading job details...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="jobs" onNavigate={() => {}}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Job Header */}
          <JobHeader job={job} onUpdate={updateJob} />
          
          {/* Main Content Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Scheduling Panel */}
              <SchedulingPanel 
                job={job} 
                onUpdate={updateJob}
                onTimelineUpdate={addTimelineEntry}
              />
              
              {/* Task Checklist */}
              <Checklist 
                tasks={job.tasks}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onTimelineUpdate={addTimelineEntry}
              />
              
              {/* Job Details Tabs */}
              <JobDetailsTabs job={job} onUpdate={updateJob} />
              
            </div>
            
            {/* Right Column - Timeline & Notes */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Notes Section */}
              <NotesSection onAddNote={addNote} />
              
              {/* Timeline Feed */}
              <TimelineFeed timeline={job.timeline} />
              
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobOverviewPage;
