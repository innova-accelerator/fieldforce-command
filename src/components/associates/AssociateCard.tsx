
import React from 'react';
import { Star, Building } from 'lucide-react';

interface AssociateCardProps {
  associate: any;
  onSelect: (associate: any) => void;
  onEdit: (associate: any) => void;
}

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
    case 'busy': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
    case 'offline': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  }
};

const AssociateCard: React.FC<AssociateCardProps> = ({ associate, onSelect, onEdit }) => (
  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">{associate.name}</h3>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
          <span className="text-muted-foreground text-sm">{associate.rating || 0}/5.0</span>
        </div>
        {associate.organizations && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-1" />
            {associate.organizations.name}
          </div>
        )}
      </div>
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getAvailabilityColor(associate.availability)}`}>
        {associate.availability}
      </span>
    </div>
    
    <div className="mb-4">
      <p className="text-muted-foreground text-sm mb-2">${associate.hourly_rate || 0}/hour</p>
      <p className="text-muted-foreground text-sm">{associate.completed_jobs || 0} completed jobs</p>
    </div>
    
    <div className="mb-4">
      <div className="flex flex-wrap gap-1">
        {(associate.skills || []).slice(0, 3).map((skill: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded border dark:border-blue-700">
            {skill}
          </span>
        ))}
        {(associate.skills?.length || 0) > 3 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border">
            +{(associate.skills?.length || 0) - 3} more
          </span>
        )}
      </div>
    </div>
    
    <div className="flex justify-end space-x-2">
      <button 
        onClick={() => onEdit(associate)}
        className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Edit
      </button>
      <button 
        onClick={() => onSelect(associate)}
        className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
);

export default AssociateCard;
