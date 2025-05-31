
import React from 'react';
import { Star, Phone, Mail, MapPin, Award, Building } from 'lucide-react';

interface AssociateCardProps {
  associate: any;
  onSelect: (associate: any) => void;
}

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
    case 'busy': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
    case 'offline': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  }
};

const AssociateCard = ({ associate, onSelect }: AssociateCardProps) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow cursor-pointer"
    onClick={() => onSelect(associate)}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{associate.name}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getAvailabilityColor(associate.availability)}`}>
            {associate.availability}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{associate.rating || 0}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">({associate.completed_jobs || 0} jobs)</span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">${associate.hourly_rate || 0}/hr</div>
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <Mail className="h-4 w-4 mr-2" />
        {associate.email}
      </div>
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <Phone className="h-4 w-4 mr-2" />
        {associate.phone}
      </div>
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <MapPin className="h-4 w-4 mr-2" />
        {associate.location_address}
      </div>
      {associate.organizations && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Building className="h-4 w-4 mr-2" />
          <span className="text-blue-600 dark:text-blue-400">{associate.organizations.name}</span>
        </div>
      )}
    </div>

    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Skills</h4>
      <div className="flex flex-wrap gap-1">
        {(associate.skills || []).slice(0, 3).map((skill: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded border dark:border-blue-700">
            {skill}
          </span>
        ))}
        {(associate.skills || []).length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded border dark:border-gray-600">
            +{(associate.skills || []).length - 3} more
          </span>
        )}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Certifications</h4>
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <Award className="h-4 w-4 mr-2" />
        {(associate.certifications || []).length > 0 ? (associate.certifications || [])[0] : 'None'}
        {(associate.certifications || []).length > 1 && ` (+${(associate.certifications || []).length - 1})`}
      </div>
    </div>
  </div>
);

export default AssociateCard;
