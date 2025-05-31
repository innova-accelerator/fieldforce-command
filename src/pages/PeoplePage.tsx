
import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Building, MapPin } from 'lucide-react';
import { usePeople, useOrganizations } from '../hooks/useData';
import AddPersonModal from '../components/modals/AddPersonModal';

const PeoplePage = () => {
  const { data: people = [], isLoading: peopleLoading, refetch } = usePeople();
  const { data: organizations = [] } = useOrganizations();
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);

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

  const handlePersonAdded = () => {
    refetch();
    setIsAddPersonModalOpen(false);
  };

  if (peopleLoading) {
    return (
      <div className="p-6 bg-background dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-background dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">People</h1>
        <button 
          onClick={() => setIsAddPersonModalOpen(true)}
          className="mt-4 sm:mt-0 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </button>
      </div>

      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        
        <select
          value={organizationFilter}
          onChange={(e) => setOrganizationFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          <div key={person.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {person.first_name} {person.last_name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{person.title}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {person.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${person.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {person.email}
                  </a>
                </div>
              )}
              {person.cell_number && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${person.cell_number}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {person.cell_number}
                  </a>
                </div>
              )}
              {person.office_number && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Office: {person.office_number}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Building className="h-4 w-4 mr-2" />
                {getOrganizationName(person.organization_id)}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No people found matching your criteria.</p>
        </div>
      )}

      {/* Add Person Modal */}
      {isAddPersonModalOpen && (
        <AddPersonModal 
          onPersonAdded={handlePersonAdded}
        />
      )}
    </div>
  );
};

export default PeoplePage;
