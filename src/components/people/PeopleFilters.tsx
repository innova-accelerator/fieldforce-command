
import React from 'react';
import { Search } from 'lucide-react';

interface PeopleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  organizationFilter: string;
  onOrganizationFilterChange: (value: string) => void;
  organizations: any[];
}

const PeopleFilters: React.FC<PeopleFiltersProps> = ({
  searchTerm,
  onSearchChange,
  organizationFilter,
  onOrganizationFilterChange,
  organizations
}) => {
  return (
    <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
          />
        </div>
      </div>
      
      <select
        value={organizationFilter}
        onChange={(e) => onOrganizationFilterChange(e.target.value)}
        className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
      >
        <option value="all">All Organizations</option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>{org.name}</option>
        ))}
      </select>
    </div>
  );
};

export default PeopleFilters;
