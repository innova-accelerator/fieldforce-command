import React, { useState } from 'react';
import { Plus, Search, Filter, Building, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { mockOrganizations } from '../data/mockData';
import { Organization } from '../types/organization';

const OrganizationsPage = () => {
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationFilter, setRelationFilter] = useState<string>('all');

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRelation = relationFilter === 'all' || org.relation === relationFilter;
    
    return matchesSearch && matchesRelation;
  });

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case 'Customer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Partner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Vendor': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Competitor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      {/* Rest of the component remains the same */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={relationFilter}
          onChange={(e) => setRelationFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Relations</option>
          <option value="Customer">Customer</option>
          <option value="Partner">Partner</option>
          <option value="Vendor">Vendor</option>
          <option value="Competitor">Competitor</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{org.category}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRelationColor(org.relation)}`}>
                {org.relation}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {org.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${org.email}`} className="text-blue-600 hover:underline">
                    {org.email}
                  </a>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${org.phone}`} className="text-blue-600 hover:underline">
                    {org.phone}
                  </a>
                </div>
              )}
              {org.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="h-4 w-4 mr-2" />
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {org.website}
                  </a>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {org.address}, {org.city}, {org.state} {org.zipcode}
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

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No organizations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;
