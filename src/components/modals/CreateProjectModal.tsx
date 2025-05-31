
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '../../integrations/supabase/client';
import { peopleApi, PersonResponse } from '../../services/api/people';

interface CreateProjectModalProps {
  onProjectCreated?: () => void;
  onClose?: () => void;
}

const PHASE_OPTIONS = ['Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'];
const STATUS_OPTIONS = ['New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'] as const;

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onProjectCreated, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [people, setPeople] = useState<PersonResponse[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<PersonResponse[]>([]);
  const [selectedClient, setSelectedClient] = useState<PersonResponse | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customer_id: '',
    organization_id: '',
    location: '',
    phase: '',
    status: 'New' as const,
    priority: 'Medium' as const,
    start_date: '',
    end_date: '',
    assigned_person_id: '',
    assigned_techs: [] as string[],
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    tags: [] as string[],
    is_favorite: false
  });

  useEffect(() => {
    fetchPeople();
  }, []);

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
        organization_id: selectedClient.organizationId || '',
        contact_name: `${selectedClient.firstName} ${selectedClient.lastName}`,
        contact_phone: selectedClient.cellNumber || selectedClient.officeNumber,
        contact_email: selectedClient.email
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
      setFormData(prev => ({ 
        ...prev, 
        customer_id: personId,
        organization_id: person.organizationId || '',
        contact_name: `${person.firstName} ${person.lastName}`,
        contact_phone: person.cellNumber || person.officeNumber || '',
        contact_email: person.email || ''
      }));
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const jobData = {
        name: formData.name,
        description: formData.description,
        customer_id: formData.customer_id,
        organization_id: formData.organization_id,
        assigned_person_id: formData.assigned_person_id || null,
        location: formData.location,
        phase: formData.phase,
        status: formData.status,
        priority: formData.priority,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        assigned_techs: formData.assigned_techs,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        tags: formData.tags,
        is_favorite: formData.is_favorite,
        user_id: user.id
      };

      const { data: newJob, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        customer_id: '',
        organization_id: '',
        location: '',
        phase: '',
        status: 'New',
        priority: 'Medium',
        start_date: '',
        end_date: '',
        assigned_person_id: '',
        assigned_techs: [],
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        tags: [],
        is_favorite: false
      });
      setSelectedClient(null);
      
      onProjectCreated?.();
      
      // Navigate to the new job overview
      navigate(`/jobs/${newJob.id}/overview`);
    } catch (error) {
      console.error('Error creating job:', error);
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
      assigned_techs: checked
        ? [...prev.assigned_techs, personId]
        : prev.assigned_techs.filter(id => id !== personId)
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-none border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create New Project</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
        {errors.general && (
          <div className="md:col-span-2 p-3 text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="md:col-span-2">
          <Label htmlFor="projectName" className="text-gray-900 dark:text-gray-100">Project Name</Label>
          <Input
            id="projectName"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="projectDescription" className="text-gray-900 dark:text-gray-100">Description</Label>
          <Textarea
            id="projectDescription"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Project description..."
            rows={3}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="clientSelect" className="text-gray-900 dark:text-gray-100">Client (Person)</Label>
          <Select onValueChange={handleClientChange} disabled={loadingPeople}>
            <SelectTrigger id="clientSelect" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder={loadingPeople ? "Loading..." : "Select client"} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {people.map(person => (
                <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {person.firstName} {person.lastName} - {person.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingClient && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Loading client data...</p>}
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="organizationDisplay" className="text-gray-900 dark:text-gray-100">Organization</Label>
          <Input
            id="organizationDisplay"
            value={selectedClient ? `${selectedClient.organizationId} (Auto-populated)` : ''}
            disabled
            placeholder="Will be auto-populated when client is selected"
            className="bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
          />
        </div>
        
        <div>
          <Label htmlFor="projectLocation" className="text-gray-900 dark:text-gray-100">Location</Label>
          <Input
            id="projectLocation"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Project location"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <Label htmlFor="projectPhase" className="text-gray-900 dark:text-gray-100">Phase</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, phase: value }))}>
            <SelectTrigger id="projectPhase" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select phase" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {PHASE_OPTIONS.map(phase => (
                <SelectItem key={phase} value={phase} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{phase}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="projectStatus" className="text-gray-900 dark:text-gray-100">Status</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))} defaultValue="New">
            <SelectTrigger id="projectStatus" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {STATUS_OPTIONS.map(status => (
                <SelectItem key={status} value={status} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="projectPriority" className="text-gray-900 dark:text-gray-100">Priority</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))} defaultValue="Medium">
            <SelectTrigger id="projectPriority" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {PRIORITY_OPTIONS.map(priority => (
                <SelectItem key={priority} value={priority} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="projectStartDate" className="text-gray-900 dark:text-gray-100">Start Date</Label>
          <Input
            id="projectStartDate"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <Label htmlFor="projectEndDate" className="text-gray-900 dark:text-gray-100">End Date</Label>
          <Input
            id="projectEndDate"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <Label htmlFor="assignedPersonSelect" className="text-gray-900 dark:text-gray-100">Assigned Person</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, assigned_person_id: value }))}>
            <SelectTrigger id="assignedPersonSelect" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select assigned person" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {filteredPeople.map(person => (
                <SelectItem key={person.id} value={person.id} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {person.firstName} {person.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredPeople.length > 0 && (
          <div className="md:col-span-2">
            <Label className="text-gray-900 dark:text-gray-100">Additional Techs (optional)</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
              {filteredPeople.map(person => (
                <div key={person.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tech-${person.id}`}
                    checked={formData.assigned_techs.includes(person.id)}
                    onCheckedChange={(checked) => handleTechToggle(person.id, checked as boolean)}
                  />
                  <Label htmlFor={`tech-${person.id}`} className="text-sm text-gray-900 dark:text-gray-100">
                    {person.firstName} {person.lastName}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="md:col-span-2">
          <Label className="text-gray-900 dark:text-gray-100">Contact Info</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <Input
              id="contactName"
              placeholder="Contact name"
              value={formData.contact_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact_name: e.target.value
              }))}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <Input
              id="contactPhone"
              placeholder="Contact phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact_phone: e.target.value
              }))}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <Input
              id="contactEmail"
              placeholder="Contact email"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact_email: e.target.value
              }))}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="projectTags" className="text-gray-900 dark:text-gray-100">Tags (comma-separated)</Label>
          <Input
            id="projectTags"
            value={formData.tags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id="isFavorite"
            checked={formData.is_favorite}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_favorite: checked as boolean }))}
          />
          <Label htmlFor="isFavorite" className="text-gray-900 dark:text-gray-100">Mark as Favorite</Label>
        </div>
        
        <div className="md:col-span-2 flex gap-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectModal;
