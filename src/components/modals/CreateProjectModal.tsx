
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Plus } from 'lucide-react';
import { createJob, mockPeople, mockOrganizations, getPersonById, getOrganizationById } from '../../data/mockData';
import { Job } from '../../types';

interface CreateProjectModalProps {
  onProjectCreated?: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onProjectCreated }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
      alert('Project Title is required');
      return;
    }

    const assignedPerson = formData.assignedPersonId ? getPersonById(formData.assignedPersonId) : null;
    const assignedOrg = assignedPerson ? getOrganizationById(assignedPerson.organizationId) : null;
    
    const jobData = {
      title: formData.title,
      name: formData.title,
      description: formData.description || 'No description provided',
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

    const newJob = createJob(jobData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'new',
      priority: 'medium',
      startDate: '',
      endDate: '',
      assignedPersonId: ''
    });
    
    setOpen(false);
    onProjectCreated?.();
    
    // Navigate to the new job overview
    navigate(`/jobs/${newJob.id}/overview`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter project title"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => handleInputChange('status', value)} defaultValue="new">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select onValueChange={(value) => handleInputChange('priority', value)} defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="assignedPersonId">Assigned Person</Label>
            <Select onValueChange={(value) => handleInputChange('assignedPersonId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select person (optional)" />
              </SelectTrigger>
              <SelectContent>
                {mockPeople.map(person => {
                  const org = getOrganizationById(person.organizationId);
                  return (
                    <SelectItem key={person.id} value={person.id}>
                      {person.firstName} {person.lastName} - {org?.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Project description..."
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2 flex gap-2 pt-4">
            <Button type="submit">Create Project</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
