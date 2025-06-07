
import React from 'react';
import { User, Mail, Phone, Building, Wrench } from 'lucide-react';

interface PersonCardProps {
  person: any;
  onEdit: (person: any) => void;
  onViewDetails: (person: any) => void;
  getOrganizationName: (organizationId: string | null) => string;
  getOrganizationClassification: (organizationId: string | null) => string | null;
}

const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onEdit,
  onViewDetails,
  getOrganizationName,
  getOrganizationClassification
}) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
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
          onClick={() => onEdit(person)}
          className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit
        </button>
        <button 
          onClick={() => onViewDetails(person)}
          className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PersonCard;
