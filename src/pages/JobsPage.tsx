
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useJobs, usePeople, useOrganizations } from '../hooks/useData';
import { Job } from '../types/job';
import { X } from 'lucide-react';
import { LoadingSkeleton, TableLoadingSkeleton } from '../components/ui/loading-skeleton';
import { ErrorDisplay } from '../components/ui/error-display';
import { assignPersonToJob, getPersonById, getOrganizationById } from '../data/mockData';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import AddOrganizationModal from '../components/modals/AddOrganizationModal';
import AddPersonModal from '../components/modals/AddPersonModal';

const JobsPage = () => {
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs();
  const { data: people = [], isLoading: peopleLoading, refetch: refetchPeople } = usePeople();
  const { data: organizations = [], refetch: refetchOrganizations } = useOrganizations();
  
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);

  const handleAssignPerson = (jobId: string, personId: string) => {
    assignPersonToJob(jobId, personId);
    refetchJobs();
    setShowAssignModal(null);
  };

  if (jobsError) {
    return (
      <Layout currentPage="jobs" onNavigate={() => {}}>
        <div className="p-6">
          <ErrorDisplay 
            message="Failed to load projects. Please try again."
            onRetry={() => refetchJobs()}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="jobs" onNavigate={() => {}}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          
          <div className="flex flex-wrap gap-2">
            <AddOrganizationModal onOrganizationAdded={() => refetchOrganizations()} />
            <AddPersonModal onPersonAdded={() => refetchPeople()} />
            <CreateProjectModal onProjectCreated={() => refetchJobs()} />
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          {jobsLoading ? (
            <div className="p-6">
              <TableLoadingSkeleton />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned Person</TableHead>
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
                      <TableCell>{job.customerName || '-'}</TableCell>
                      <TableCell>{organization?.name || '-'}</TableCell>
                      <TableCell>{job.startDate ? new Date(job.startDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{job.endDate ? new Date(job.endDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          job.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                          job.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        {assignedPerson ? `${assignedPerson.firstName} ${assignedPerson.lastName}` : '-'}
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
                <h3 id="assign-modal-title" className="text-lg font-semibold">Assign Person to Project</h3>
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
