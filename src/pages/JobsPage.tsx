import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useJobs, usePeople, useOrganizations } from '../hooks/useData';
import { Job } from '../types/job';
import { Plus, X } from 'lucide-react';
import { LoadingSkeleton, TableLoadingSkeleton } from '../components/ui/loading-skeleton';
import { ErrorDisplay } from '../components/ui/error-display';
import { createJob, assignPersonToJob, getPersonById, getOrganizationById } from '../data/mockData';

const JobsPage = () => {
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs();
  const { data: people = [], isLoading: peopleLoading } = usePeople();
  const { data: organizations = [] } = useOrganizations();
  
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new' as Job['status'],
    priority: 'medium' as Job['priority'],
    startDate: '',
    endDate: '',
    assignedPersonId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Job Title is required');
      return;
    }

    const assignedPerson = formData.assignedPersonId ? getPersonById(formData.assignedPersonId) : null;
    const assignedOrg = assignedPerson ? getOrganizationById(assignedPerson.organizationId) : null;
    
    const jobData = {
      title: formData.title,
      name: formData.title, // Added missing name property
      description: formData.description || 'No description provided', // Ensure description is always provided
      status: formData.status,
      priority: formData.priority,
      startDate: formData.startDate ? new Date(formData.startDate) : undefined,
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      assignedPersonId: formData.assignedPersonId || undefined,
      client: assignedOrg?.name || 'Unknown Client',
      phase: 'Planning',
      location: assignedOrg?.address ? `${assignedOrg.address}, ${assignedOrg.city}, ${assignedOrg.state} ${assignedOrg.zipcode}` : 'TBD',
      isFavorite: false,
      assignedTechs: [],
      tasks: [],
      notes: [],
      timeline: [],
      contactInfo: assignedPerson ? {
        name: `${assignedPerson.firstName} ${assignedPerson.lastName}`,
        phone: assignedPerson.cellNumber || '',
        email: assignedPerson.email
      } : {
        name: '',
        phone: '',
        email: ''
      },
      organizationId: assignedPerson ? assignedPerson.organizationId : undefined,
      customerId: assignedPerson?.organizationId,
      customerName: assignedOrg?.name || 'Unknown Client',
      estimatedDuration: 8,
      scheduledDate: formData.startDate ? new Date(formData.startDate) : undefined,
      tags: [] as string[],
      assignedToName: assignedPerson ? `${assignedPerson.firstName} ${assignedPerson.lastName}` : undefined
    };

    createJob(jobData);
    refetchJobs();
    setFormData({
      title: '',
      description: '',
      status: 'new',
      priority: 'medium',
      startDate: '',
      endDate: '',
      assignedPersonId: ''
    });
    setShowForm(false);
  };

  const handleAssignPerson = (jobId: string, personId: string) => {
    assignPersonToJob(jobId, personId);
    refetchJobs();
    setShowAssignModal(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (jobsError) {
    return (
      <Layout currentPage="jobs" onNavigate={() => {}}>
        <div className="p-6">
          <ErrorDisplay 
            message="Failed to load jobs. Please try again."
            onRetry={() => refetchJobs()}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="jobs" onNavigate={() => {}}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg border mb-6" role="dialog" aria-labelledby="new-job-title">
            <div className="flex justify-between items-center mb-4">
              <h2 id="new-job-title" className="text-lg font-semibold">Create New Job</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned Person</label>
                <select
                  value={formData.assignedPersonId}
                  onChange={(e) => handleInputChange('assignedPersonId', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={peopleLoading}
                >
                  <option value="">Select person (optional)</option>
                  {people.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName} - {getOrganizationById(person.organizationId)?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Create Job</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg border">
          {jobsLoading ? (
            <div className="p-6">
              <TableLoadingSkeleton />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Person</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => {
                  const assignedPerson = job.assignedPersonId ? getPersonById(job.assignedPersonId) : null;
                  const organization = job.organizationId ? getOrganizationById(job.organizationId) : null;
                  
                  return (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <Link to={`/jobs/${job.id}/overview`} className="text-blue-600 hover:underline">
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {assignedPerson ? `${assignedPerson.firstName} ${assignedPerson.lastName}` : '-'}
                      </TableCell>
                      <TableCell>{organization?.name || '-'}</TableCell>
                      <TableCell>{job.startDate ? job.startDate.toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{job.endDate ? job.endDate.toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        {!job.assignedPersonId && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowAssignModal(job.id)}
                          >
                            Assign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Assign Person Modal */}
        {showAssignModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="assign-modal-title"
          >
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 id="assign-modal-title" className="text-lg font-semibold">Assign Person to Job</h3>
                <button 
                  onClick={() => setShowAssignModal(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {people.map(person => {
                  const organization = getOrganizationById(person.organizationId);
                  return (
                    <button
                      key={person.id}
                      onClick={() => handleAssignPerson(showAssignModal, person.id)}
                      className="w-full text-left p-3 border rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <div className="font-medium">{person.firstName} {person.lastName}</div>
                      <div className="text-sm text-gray-600">{person.title}</div>
                      <div className="text-sm text-gray-500">{organization?.name}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setShowAssignModal(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobsPage;
