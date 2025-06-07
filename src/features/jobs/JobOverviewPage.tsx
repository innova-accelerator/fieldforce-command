
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import JobHeader from './components/JobHeader';
import JobSidebar from './components/JobSidebar';
import SchedulingPanel from './components/SchedulingPanel';
import TaskEngine from './components/TaskEngine/TaskEngine';
import NotesSection from './components/NotesSection';
import TimelineFeed from './components/TimelineFeed';
import JobDetailsTabs from './components/JobDetailsTabs';
import { fetchJob, updateJob } from '../../services/jobs';
import { Job, Task, TimelineEntry } from '../../types/job';

const JobOverviewPage: React.FC = () => {
  console.log('🏠 JobOverviewPage - Component mounted');
  
  const { jobId } = useParams<{ jobId: string }>();
  console.log('🆔 JobOverviewPage - jobId from params:', jobId);
  
  const queryClient = useQueryClient();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => {
      console.log('🔍 JobOverviewPage - Query function called for jobId:', jobId);
      return fetchJob(jobId!);
    },
    enabled: !!jobId,
  });

  console.log('📊 JobOverviewPage - Query state:', {
    isLoading,
    hasError: !!error,
    hasJob: !!job,
    jobId: job?.id,
    jobName: job?.name,
    jobNumber: job?.job_number
  });

  const updateJobMutation = useMutation({
    mutationFn: (updates: Partial<Job>) => {
      console.log('🔄 JobOverviewPage - updateJobMutation called with updates:', updates);
      return updateJob(jobId!, updates);
    },
    onSuccess: (updatedJob) => {
      console.log('✅ JobOverviewPage - Job update successful:', updatedJob);
      queryClient.setQueryData(['job', jobId], updatedJob);
    },
    onError: (error) => {
      console.error('❌ JobOverviewPage - Job update failed:', error);
    }
  });

  const handleUpdateJob = (updates: Partial<Job>) => {
    console.log('🎯 JobOverviewPage - handleUpdateJob called with:', updates);
    updateJobMutation.mutate(updates);
  };

  const addTimelineEntry = (entry: Omit<TimelineEntry, 'timestamp' | 'id' | 'job_id' | 'created_at'>) => {
    console.log('📝 JobOverviewPage - addTimelineEntry called with:', entry);
    if (!job) {
      console.warn('⚠️ JobOverviewPage - Cannot add timeline entry, no job available');
      return;
    }
    
    const newEntry: TimelineEntry = {
      ...entry,
      id: `timeline-${Date.now()}`,
      job_id: job.id,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    const updatedTimeline = [newEntry, ...(job.timeline || [])];
    handleUpdateJob({ timeline: updatedTimeline });
  };

  const addNote = (content: string) => {
    console.log('📝 JobOverviewPage - addNote called with content:', content);
    if (!job) {
      console.warn('⚠️ JobOverviewPage - Cannot add note, no job available');
      return;
    }
    
    const newEntry: TimelineEntry = {
      id: `timeline-${Date.now()}`,
      job_id: job.id,
      timestamp: new Date().toISOString(),
      type: 'note',
      content,
      author_id: undefined,
      created_at: new Date().toISOString()
    };
    
    const updatedNotes = [...(job.notes || []), content];
    const updatedTimeline = [newEntry, ...(job.timeline || [])];
    
    handleUpdateJob({ 
      notes: updatedNotes, 
      timeline: updatedTimeline 
    });
  };

  if (isLoading) {
    console.log('⏳ JobOverviewPage - Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-foreground">Loading job details...</div>
      </div>
    );
  }

  if (error) {
    console.error('❌ JobOverviewPage - Showing error state:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-destructive">Error loading job details</div>
      </div>
    );
  }

  if (!job) {
    console.warn('⚠️ JobOverviewPage - Showing not found state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-muted-foreground">Job not found</div>
      </div>
    );
  }

  console.log('🎨 JobOverviewPage - Rendering job overview for:', {
    id: job.id,
    name: job.name,
    job_number: job.job_number,
    customerName: job.customerName
  });

  return (
    <div className="min-h-screen bg-background">
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
            
            {/* Task Engine */}
            <TaskEngine 
              job={job}
              onUpdate={handleUpdateJob}
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
            <TimelineFeed timeline={job.timeline || []} />
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default JobOverviewPage;
