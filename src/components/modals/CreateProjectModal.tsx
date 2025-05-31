
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { CreateProjectModalProps, FormData } from './CreateProjectModal/types';
import { useCreateProject } from './CreateProjectModal/hooks/useCreateProject';
import { usePeopleData } from './CreateProjectModal/hooks/usePeopleData';
import { BasicInfoFields } from './CreateProjectModal/components/BasicInfoFields';
import { ClientFields } from './CreateProjectModal/components/ClientFields';
import { StatusFields } from './CreateProjectModal/components/StatusFields';
import { AssignmentFields } from './CreateProjectModal/components/AssignmentFields';

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onProjectCreated, onClose }) => {
  const { createProject, loading, errors } = useCreateProject(() => {
    onProjectCreated?.();
    onClose?.();
  });
  const {
    people,
    loadingPeople,
    loadingClient,
    filteredPeople,
    selectedClient,
    errors: peopleErrors,
    handleClientChange
  } = usePeopleData();

  const [formData, setFormData] = useState<FormData>({
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

  useEffect(() => {
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        customer_id: selectedClient.id,
        organization_id: selectedClient.organizationId || '',
        contact_name: `${selectedClient.firstName} ${selectedClient.lastName}`,
        contact_phone: selectedClient.cellNumber || selectedClient.officeNumber || '',
        contact_email: selectedClient.email || ''
      }));
    }
  }, [selectedClient]);

  const handleFormChange = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      return;
    }

    try {
      await createProject(formData);
      // Reset form after successful creation
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
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to create project:', error);
    }
  };

  const handleTechToggle = (personId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assigned_techs: checked
        ? [...prev.assigned_techs, personId]
        : prev.assigned_techs.filter(id => id !== personId)
    }));
  };

  const allErrors = { ...errors, ...peopleErrors };

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
        {allErrors.general && (
          <div className="md:col-span-2 p-3 text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            {allErrors.general}
          </div>
        )}

        <BasicInfoFields formData={formData} onChange={handleFormChange} />
        
        <ClientFields
          formData={formData}
          onChange={handleFormChange}
          people={people}
          selectedClient={selectedClient}
          loadingPeople={loadingPeople}
          loadingClient={loadingClient}
          onClientChange={handleClientChange}
        />
        
        <StatusFields formData={formData} onChange={handleFormChange} />
        
        <AssignmentFields
          formData={formData}
          onChange={handleFormChange}
          filteredPeople={filteredPeople}
          selectedClient={selectedClient}
          onTechToggle={handleTechToggle}
        />
        
        <div className="md:col-span-2 flex gap-2 pt-4">
          <Button type="submit" disabled={loading || !formData.name.trim()}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProjectModal;
