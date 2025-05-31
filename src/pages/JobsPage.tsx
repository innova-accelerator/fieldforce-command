
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockNewJobs, mockPeople, mockOrganizations, createJob, assignPersonToJob, getPersonById, getOrganizationById } from '../data/mockData';
import { Job } from '../types/job';
import { Plus } from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>(mockNewJobs);
  const [showForm, setShowForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'new' as Job['status'],
    priority: 'medium' as Job['priority'],
    startDate: '',
    endDate: '',
    assignedPersonId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Job Name is required');
      return;
    }

    const assignedPerson = formData.assignedPersonId ? getPersonById(formData.assignedPersonId) : null;
    const jobData = {
      ...formData,
      organizationId: assignedPerson ? assignedPerson.organizationId : undefined
    };

    const newJob = createJob(jobData);
    setJobs([...jobs, newJob]);
    setFormData({
      name: '',
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
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        const person = getPersonById(personId);
        return {
          ...job,
          assignedPersonId: personId,
          organizationId: person?.organizationId
        };
      }
      return job;
    }));
    setShowAssignModal(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h2 className="text-lg font-semibold mb-4">Create New Job</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
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
                  className="w-full px-3 py-2 border rounded-md"
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
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select person (optional)</option>
                  {mockPeople.map(person => (
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
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
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
                        {job.name}
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
                    <TableCell>{job.startDate || '-'}</TableCell>
                    <TableCell>{job.endDate || '-'}</TableCell>
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
        </div>

        {/* Assign Person Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Assign Person to Job</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {mockPeople.map(person => {
                  const organization = getOrganizationById(person.organizationId);
                  return (
                    <button
                      key={person.id}
                      onClick={() => handleAssignPerson(showAssignModal, person.id)}
                      className="w-full text-left p-3 border rounded-md hover:bg-gray-50"
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
