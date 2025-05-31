import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Building, MapPin } from 'lucide-react';
import { mockPeople, mockOrganizations } from '../data/mockData';
import { Person } from '../types/person';

const PeoplePage = () => {
  const [people] = useState<Person[]>(mockPeople);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');

  const filteredPeople = people.filter(person => {
    const fullName = `${person.firstName} ${person.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrganization = organizationFilter === 'all' || person.organizationId === organizationFilter;
    
    return matchesSearch && matchesOrganization;
  });

  const getOrganizationName = (organizationId: string | undefined) => {
    if (!organizationId) return 'No Organization';
    const org = mockOrganizations.find(o => o.id === organizationId);
    return org?.name || 'Unknown Organization';
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">People</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </button>
      </div>

      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={organizationFilter}
          onChange={(e) => setOrganizationFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Organizations</option>
          {mockOrganizations.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPeople.map((person) => (
          <div key={person.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {person.firstName} {person.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{person.title}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {person.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${person.email}`} className="text-blue-600 hover:underline">
                    {person.email}
                  </a>
                </div>
              )}
              {person.cellNumber && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${person.cellNumber}`} className="text-blue-600 hover:underline">
                    {person.cellNumber}
                  </a>
                </div>
              )}
              {person.officeNumber && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Office: {person.officeNumber}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-2" />
                {getOrganizationName(person.organizationId)}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No people found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
