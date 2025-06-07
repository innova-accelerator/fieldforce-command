
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAssociates } from '../hooks/useData';
import AssociateCard from './associates/AssociateCard';
import AssociateDetailsModal from './associates/AssociateDetailsModal';
import EditAssociateModal from './associates/EditAssociateModal';
import AssociateFilters from './associates/AssociateFilters';
import AssociateLoadingSkeleton from './associates/AssociateLoadingSkeleton';
import AddUnifiedOrganizationModal from './modals/AddUnifiedOrganizationModal';

const AssociateDirectory = () => {
  const { data: associates = [], isLoading, refetch } = useAssociates();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [selectedAssociate, setSelectedAssociate] = useState<any | null>(null);
  const [selectedAssociateForEdit, setSelectedAssociateForEdit] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredAssociates = associates.filter(associate => {
    const matchesSearch = associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (associate.skills && associate.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                         (associate.certifications && associate.certifications.some((cert: string) => cert.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesAvailability = availabilityFilter === 'all' || associate.availability === availabilityFilter;
    
    return matchesSearch && matchesAvailability;
  });

  const handleAssociateUpdated = () => {
    refetch();
    setSelectedAssociateForEdit(null);
  };

  const handleOrganizationAdded = () => {
    refetch();
    setShowAddModal(false);
  };

  const handleEdit = (associate: any) => {
    setSelectedAssociateForEdit(associate);
  };

  if (isLoading) {
    return <AssociateLoadingSkeleton />;
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Associates</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
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
            onEdit={handleEdit}
          />
        ))}
      </div>

      {filteredAssociates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No associates found matching your criteria.</p>
        </div>
      )}

      {/* Add Associate Modal */}
      <AddUnifiedOrganizationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onOrganizationAdded={handleOrganizationAdded}
        defaultClassification="associate"
      />

      {/* Associate Details Modal */}
      {selectedAssociate && (
        <AssociateDetailsModal
          associate={selectedAssociate}
          onClose={() => setSelectedAssociate(null)}
        />
      )}

      {/* Edit Associate Modal */}
      {selectedAssociateForEdit && (
        <EditAssociateModal
          associate={selectedAssociateForEdit}
          onClose={() => setSelectedAssociateForEdit(null)}
          onAssociateUpdated={handleAssociateUpdated}
        />
      )}
    </div>
  );
};

export default AssociateDirectory;
