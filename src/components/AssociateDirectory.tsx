
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAssociates } from '../hooks/useData';
import AssociateCard from './associates/AssociateCard';
import AssociateDetailsModal from './associates/AssociateDetailsModal';
import AssociateFilters from './associates/AssociateFilters';
import AssociateLoadingSkeleton from './associates/AssociateLoadingSkeleton';

const AssociateDirectory = () => {
  const { data: associates = [], isLoading } = useAssociates();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [selectedAssociate, setSelectedAssociate] = useState<any | null>(null);

  const filteredAssociates = associates.filter(associate => {
    const matchesSearch = associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (associate.skills && associate.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                         (associate.certifications && associate.certifications.some((cert: string) => cert.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesAvailability = availabilityFilter === 'all' || associate.availability === availabilityFilter;
    
    return matchesSearch && matchesAvailability;
  });

  if (isLoading) {
    return <AssociateLoadingSkeleton />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Associates</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Associate
        </button>
      </div>

      {/* Filters */}
      <AssociateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
      />

      {/* Associates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssociates.map((associate) => (
          <AssociateCard 
            key={associate.id} 
            associate={associate} 
            onSelect={setSelectedAssociate}
          />
        ))}
      </div>

      {filteredAssociates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No associates found matching your criteria.</p>
        </div>
      )}

      {/* Associate Details Modal */}
      {selectedAssociate && (
        <AssociateDetailsModal
          associate={selectedAssociate}
          onClose={() => setSelectedAssociate(null)}
        />
      )}
    </div>
  );
};

export default AssociateDirectory;
