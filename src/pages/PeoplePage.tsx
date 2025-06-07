
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePeople, useOrganizations } from '../hooks/useData';
import AddPersonModal from '../components/modals/AddPersonModal';
import ViewPersonModal from '../components/modals/ViewPersonModal';
import EditPersonModal from '../components/modals/EditPersonModal';
import PeopleFilters from '../components/people/PeopleFilters';
import PeopleGrid from '../components/people/PeopleGrid';
import PeopleLoadingSkeleton from '../components/people/PeopleLoadingSkeleton';

const PeoplePage = () => {
  const { data: people = [], isLoading: peopleLoading, refetch } = usePeople();
  const { data: organizations = [] } = useOrganizations();
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [selectedPersonForView, setSelectedPersonForView] = useState<any | null>(null);
  const [selectedPersonForEdit, setSelectedPersonForEdit] = useState<any | null>(null);

  const filteredPeople = people.filter(person => {
    const fullName = `${person.first_name} ${person.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganization = organizationFilter === 'all' || person.organization_id === organizationFilter;
    
    return matchesSearch && matchesOrganization;
  });

  const getOrganizationName = (organizationId: string | null) => {
    if (!organizationId) return 'No Organization';
    const org = organizations.find(o => o.id === organizationId);
    return org?.name || 'Unknown Organization';
  };

  const getOrganizationClassification = (organizationId: string | null) => {
    if (!organizationId) return null;
    const org = organizations.find(o => o.id === organizationId);
    return org?.classification || null;
  };

  const handlePersonAdded = () => {
    refetch();
    setIsAddPersonModalOpen(false);
  };

  const handlePersonUpdated = () => {
    refetch();
    setSelectedPersonForEdit(null);
  };

  const handleViewDetails = (person: any) => {
    setSelectedPersonForView(person);
  };

  const handleEdit = (person: any) => {
    setSelectedPersonForEdit(person);
  };

  const handleEditFromView = () => {
    if (selectedPersonForView) {
      setSelectedPersonForEdit(selectedPersonForView);
      setSelectedPersonForView(null);
    }
  };

  if (peopleLoading) {
    return <PeopleLoadingSkeleton />;
  }
  
  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">People</h1>
        <button 
          onClick={() => setIsAddPersonModalOpen(true)}
          className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </button>
      </div>

      <PeopleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        organizationFilter={organizationFilter}
        onOrganizationFilterChange={setOrganizationFilter}
        organizations={organizations}
      />

      <PeopleGrid
        people={filteredPeople}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        getOrganizationName={getOrganizationName}
        getOrganizationClassification={getOrganizationClassification}
      />

      {/* Modals */}
      {isAddPersonModalOpen && (
        <AddPersonModal 
          onPersonAdded={handlePersonAdded}
        />
      )}

      {selectedPersonForView && (
        <ViewPersonModal
          person={selectedPersonForView}
          onClose={() => setSelectedPersonForView(null)}
          onEdit={handleEditFromView}
        />
      )}

      {selectedPersonForEdit && (
        <EditPersonModal
          person={selectedPersonForEdit}
          onClose={() => setSelectedPersonForEdit(null)}
          onPersonUpdated={handlePersonUpdated}
        />
      )}
    </div>
  );
};

export default PeoplePage;
