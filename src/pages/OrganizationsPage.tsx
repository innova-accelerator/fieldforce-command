
import React, { useState } from 'react';
import { Plus, Search, Filter, Building, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { useOrganizations } from '../hooks/useData';
import AddUnifiedOrganizationModal from '../components/modals/AddUnifiedOrganizationModal';
import EditOrganizationModal from '../components/modals/EditOrganizationModal';

const OrganizationsPage = () => {
  const { data: organizations = [], isLoading, refetch } = useOrganizations();
  const [searchTerm, setSearchTerm] = useState('');
  const [relationFilter, setRelationFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrganizationForEdit, setSelectedOrganizationForEdit] = useState<any | null>(null);

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRelation = relationFilter === 'all' || org.relation === relationFilter;
    
    return matchesSearch && matchesRelation;
  });

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case 'Customer': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Partner': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'Vendor': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Competitor': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'associate': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'customer': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleOrganizationAdded = () => {
    refetch();
    setIsAddModalOpen(false);
  };

  const handleOrganizationUpdated = () => {
    refetch();
    setSelectedOrganizationForEdit(null);
  };

  const handleEdit = (organization: any) => {
    setSelectedOrganizationForEdit(organization);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg shadow-sm border border-border p-6">
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
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Organizations</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={relationFilter}
          onChange={(e) => setRelationFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
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
          <div key={org.id} className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">{org.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{org.category}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRelationColor(org.relation)}`}>
                  {org.relation}
                </span>
                {org.classification && (
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getClassificationColor(org.classification)}`}>
                    {org.classification}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {org.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href={`mailto:${org.email}`} className="text-primary hover:underline">
                    {org.email}
                  </a>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href={`tel:${org.phone}`} className="text-primary hover:underline">
                    {org.phone}
                  </a>
                </div>
              )}
              {org.website && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 mr-2" />
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {org.website}
                  </a>
                </div>
              )}
              {(org.address || org.city || org.state || org.zipcode) && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {[org.address, org.city, org.state, org.zipcode].filter(Boolean).join(', ')}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => handleEdit(org)}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Edit
              </button>
              <button className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No organizations found matching your criteria.</p>
        </div>
      )}

      <AddUnifiedOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onOrganizationAdded={handleOrganizationAdded}
      />

      {selectedOrganizationForEdit && (
        <EditOrganizationModal
          organization={selectedOrganizationForEdit}
          onClose={() => setSelectedOrganizationForEdit(null)}
          onOrganizationUpdated={handleOrganizationUpdated}
        />
      )}
    </div>
  );
};

export default OrganizationsPage;
