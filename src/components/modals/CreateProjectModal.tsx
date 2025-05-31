
import React, { useState, useEffect } from 'react';
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
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus } from 'lucide-react';
import { jobsApi, CreateJobRequest } from '../../services/api/jobs';
import { peopleApi, PersonResponse } from '../../services/api/people';

interface CreateProjectModalProps {
  onProjectCreated?: () => void;
}

const PHASE_OPTIONS = ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'];
const STATUS_OPTIONS = ['New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'] as const;

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onProjectCreated }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [people, setPeople] = useState<PersonResponse[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<PersonResponse[]>([]);
  const [selectedClient, setSelectedClient] = useState<PersonResponse | null>(null);
  
  const [formData, setFormData] = useState<CreateJobRequest>({
    name: '',
    description: '',
    clientId: '',
    organizationId: '',
    location: '',
    phase: '',
    status: 'New',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    assignedPersonId: '',
    assignedTechs: [],
    contactInfo: {
      name: '',
      phone: '',
      email: ''
    },
    tags: [],
    isFavorite: false
  });

  useEffect(() => {
    if (open) {
      fetchPeople();
    }
  }, [open]);

  useEffect(() => {
    if (selectedClient) {
      // Filter people by same organization
      const filtered = people.filter(person => 
        person.organizationId === selectedClient.organizationId
      );
      setFilteredPeople(filtered);
      
      // Update form with client data
      setFormData(prev => ({
        ...prev,
        organizationId: selectedClient.organizationId || '',
        contactInfo: {
          name: `${selectedClient.firstName} ${selectedClient.lastName}`,
          phone: selectedClient.cellNumber || selectedClient.officeNumber,
          email: selectedClient.email
        }
      }));
    } else {
      setFilteredPeople([]);
    }
  }, [selectedClient, people]);

  const fetchPeople = async () => {
    setLoadingPeople(true);
    try {
      const peopleData = await peopleApi.getAll();
      setPeople(peopleData);
    } catch (error) {
      console.error('Failed to fetch people:', error);
      setErrors({ general: 'Failed to load people' });
    } finally {
      setLoadingPeople(false);
    }
  };

  const handleClientChange = async (personId: string) => {
    setLoadingClient(true);
    try {
      const person = await peopleApi.getById(personId);
      setSelectedClient(person);
      setFormData(prev => ({ ...prev, clientId: personId }));
    } catch (error) {
      console.error('Failed to fetch client data:', error);
      setErrors({ client: 'Failed to load client data' });
    } finally {
      setLoadingClient(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await jobsApi.create(formData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        clientId: '',
        organizationId: '',
        location: '',
        phase: '',
        status: 'New',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        assignedPersonId: '',
        assignedTechs: [],
        contactInfo: {
          name: '',
          phone: '',
          email: ''
        },
        tags: [],
        isFavorite: false
      });
      setSelectedClient(null);
      
      setOpen(false);
      onProjectCreated?.();
      
      // Navigate to the new job overview
      navigate(`/jobs/${response.id}/overview`);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleTechToggle = (personId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedTechs: checked
        ? [...prev.assignedTechs, personId]
        : prev.assignedTechs.filter(id => id !== personId)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {errors.general && (
            <div className="md:col-span-2 p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea
              id="projectDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description..."
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="clientSelect">Client (Person)</Label>
            <Select onValueChange={handleClientChange} disabled={loadingPeople}>
              <SelectTrigger id="clientSelect">
                <SelectValue placeholder={loadingPeople ? "Loading..." : "Select client"} />
              </SelectTrigger>
              <SelectContent>
                {people.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.firstName} {person.lastName} - {person.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadingClient && <p className="text-sm text-gray-500 mt-1">Loading client data...</p>}
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="organizationDisplay">Organization</Label>
            <Input
              id="organizationDisplay"
              value={selectedClient ? `${selectedClient.organizationId} (Auto-populated)` : ''}
              disabled
              placeholder="Will be auto-populated when client is selected"
            />
          </div>
          
          <div>
            <Label htmlFor="projectLocation">Location</Label>
            <Input
              id="projectLocation"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Project location"
            />
          </div>
          
          <div>
            <Label htmlFor="projectPhase">Phase</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, phase: value }))}>
              <SelectTrigger id="projectPhase">
                <SelectValue placeholder="Select phase" />
              </SelectTrigger>
              <SelectContent>
                {PHASE_OPTIONS.map(phase => (
                  <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="projectStatus">Status</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))} defaultValue="New">
              <SelectTrigger id="projectStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="projectPriority">Priority</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))} defaultValue="Medium">
              <SelectTrigger id="projectPriority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map(priority => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="projectStartDate">Start Date</Label>
            <Input
              id="projectStartDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="projectEndDate">End Date</Label>
            <Input
              id="projectEndDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="assignedPersonSelect">Assigned Person</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, assignedPersonId: value }))}>
              <SelectTrigger id="assignedPersonSelect">
                <SelectValue placeholder="Select assigned person" />
              </SelectTrigger>
              <SelectContent>
                {filteredPeople.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filteredPeople.length > 0 && (
            <div className="md:col-span-2">
              <Label>Additional Techs (optional)</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {filteredPeople.map(person => (
                  <div key={person.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${person.id}`}
                      checked={formData.assignedTechs.includes(person.id)}
                      onCheckedChange={(checked) => handleTechToggle(person.id, checked as boolean)}
                    />
                    <Label htmlFor={`tech-${person.id}`} className="text-sm">
                      {person.firstName} {person.lastName}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="md:col-span-2">
            <Label>Contact Info</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <Input
                id="contactName"
                placeholder="Contact name"
                value={formData.contactInfo.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, name: e.target.value }
                }))}
              />
              <Input
                id="contactPhone"
                placeholder="Contact phone"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
              />
              <Input
                id="contactEmail"
                placeholder="Contact email"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="projectTags">Tags (comma-separated)</Label>
            <Input
              id="projectTags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          
          <div className="md:col-span-2 flex items-center space-x-2">
            <Checkbox
              id="isFavorite"
              checked={formData.isFavorite}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFavorite: checked as boolean }))}
            />
            <Label htmlFor="isFavorite">Mark as Favorite</Label>
          </div>
          
          <div className="md:col-span-2 flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
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
