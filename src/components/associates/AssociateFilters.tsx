
import React from 'react';
import { Search } from 'lucide-react';

interface AssociateFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityFilterChange: (value: string) => void;
}

const AssociateFilters = ({ 
  searchTerm, 
  onSearchChange, 
  availabilityFilter, 
  onAvailabilityFilterChange 
}: AssociateFiltersProps) => (
  <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search associates by name, skills, or certifications..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <select
      value={availabilityFilter}
      onChange={(e) => onAvailabilityFilterChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="all">All Availability</option>
      <option value="available">Available</option>
      <option value="busy">Busy</option>
      <option value="offline">Offline</option>
    </select>
  </div>
);

export default AssociateFilters;
