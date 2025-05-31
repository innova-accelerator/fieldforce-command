
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import JobHeader from './components/JobHeader';
import JobSidebar from './components/JobSidebar';
import SchedulingPanel from './components/SchedulingPanel';
import Checklist from './components/Checklist';
import NotesSection from './components/NotesSection';
import TimelineFeed from './components/TimelineFeed';
import JobDetailsTabs from './components/JobDetailsTabs';
import { fetchJob, updateJob } from '../../services/jobs';
import { Job, Task, TimelineEntry } from '../../types/job';

const JobOverviewPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const queryClient = useQueryClient();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJob(jobId!),
    enabled: !!jobId,
  });

  const updateJobMutation = useMutation({
    mutationFn: (updates: Partial<Job>) => updateJob(jobId!, updates),
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['job', jobId], updatedJob);
    },
  });

  const handleUpdateJob = (updates: Partial<Job>) => {
    updateJobMutation.mutate(updates);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    if (!job) return;
    
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };
    
    const updatedTasks = [...job.tasks, newTask];
    handleUpdateJob({ tasks: updatedTasks });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!job) return;
    
    const updatedTasks = job.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    handleUpdateJob({ tasks: updatedTasks });
  };

  const addNote = (content: string) => {
    if (!job) return;
    
    const newEntry: TimelineEntry = {
      timestamp: new Date().toISOString(),
      type: 'note',
      content,
      author: 'Current User'
    };
    
    const updatedNotes = [...job.notes, content];
    const updatedTimeline = [newEntry, ...job.timeline];
    
    handleUpdateJob({ 
      notes: updatedNotes, 
      timeline: updatedTimeline 
    });
  };

  const addTimelineEntry = (entry: Omit<TimelineEntry, 'timestamp'>) => {
    if (!job) return;
    
    const newEntry: TimelineEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    const updatedTimeline = [newEntry, ...job.timeline];
    handleUpdateJob({ timeline: updatedTimeline });
  };

  if (isLoading) {
    return (
      <Layout currentPage="jobs" onNavigate={() => {}}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading job details...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="jobs" onNavigate={() => {}}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">Error loading job details</div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout currentPage="jobs" onNavigate={() => {}}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Job not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="jobs" onNavigate={() => {}}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Job Header */}
          <JobHeader job={job} onUpdate={handleUpdateJob} />
          
          {/* Two-column layout */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Scheduling Panel */}
              <SchedulingPanel 
                job={job} 
                onUpdate={handleUpdateJob}
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
              <JobDetailsTabs job={job} onUpdate={handleUpdateJob} />
              
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Job Info Sidebar */}
              <JobSidebar job={job} onUpdate={handleUpdateJob} />
              
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
