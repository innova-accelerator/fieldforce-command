import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Building, MapPin, Wrench } from 'lucide-react';
import { usePeople, useOrganizations } from '../hooks/useData';
import AddPersonModal from '../components/modals/AddPersonModal';
import ViewPersonModal from '../components/modals/ViewPersonModal';
import EditPersonModal from '../components/modals/EditPersonModal';

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
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            />
          </div>
        </div>
        
        <select
          value={organizationFilter}
          onChange={(e) => setOrganizationFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
        >
          <option value="all">All Organizations</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPeople.map((person) => (
          <div key={person.id} className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {person.first_name} {person.last_name}
                  </h3>
                  {person.is_technician && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      <Wrench className="h-3 w-3" />
                      <span>Tech</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{person.title}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {person.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                    {person.email}
                  </a>
                </div>
              )}
              {person.cell_number && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${person.cell_number}`} className="text-primary hover:underline">
                    {person.cell_number}
                  </a>
                </div>
              )}
              {person.office_number && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Office: {person.office_number}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Building className="h-4 w-4 mr-2" />
                <span>
                  {getOrganizationName(person.organization_id)}
                  {getOrganizationClassification(person.organization_id) === 'associate' && 
                    <span className="text-blue-600 dark:text-blue-400 ml-1">(Associate)</span>
                  }
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => handleEdit(person)}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={() => handleViewDetails(person)}
                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No people found matching your criteria.</p>
        </div>
      )}

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
