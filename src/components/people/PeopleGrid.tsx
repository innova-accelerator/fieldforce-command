
import React from 'react';
import PersonCard from './PersonCard';

interface PeopleGridProps {
  people: any[];
  onEdit: (person: any) => void;
  onViewDetails: (person: any) => void;
  getOrganizationName: (organizationId: string | null) => string;
  getOrganizationClassification: (organizationId: string | null) => string | null;
}

const PeopleGrid: React.FC<PeopleGridProps> = ({
  people,
  onEdit,
  onViewDetails,
  getOrganizationName,
  getOrganizationClassification
}) => {
  if (people.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No people found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
          getOrganizationName={getOrganizationName}
          getOrganizationClassification={getOrganizationClassification}
        />
      ))}
    </div>
  );
};

export default PeopleGrid;
