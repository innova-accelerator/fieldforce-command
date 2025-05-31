
import React from 'react';
import { Star, Phone, Mail, MapPin, Award, Building } from 'lucide-react';

interface AssociateCardProps {
  associate: any;
  onSelect: (associate: any) => void;
}

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available': return 'bg-green-100 text-green-800 border-green-200';
    case 'busy': return 'bg-red-100 text-red-800 border-red-200';
    case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const AssociateCard = ({ associate, onSelect }: AssociateCardProps) => (
  <div 
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onSelect(associate)}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{associate.name}</h3>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getAvailabilityColor(associate.availability)}`}>
            {associate.availability}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">{associate.rating || 0}</span>
          <span className="text-sm text-gray-500">({associate.completed_jobs || 0} jobs)</span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">${associate.hourly_rate || 0}/hr</div>
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <Mail className="h-4 w-4 mr-2" />
        {associate.email}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="h-4 w-4 mr-2" />
        {associate.phone}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="h-4 w-4 mr-2" />
        {associate.location_address}
      </div>
      {associate.organizations && (
        <div className="flex items-center text-sm text-gray-600">
          <Building className="h-4 w-4 mr-2" />
          <span className="text-blue-600">{associate.organizations.name}</span>
        </div>
      )}
    </div>

    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
      <div className="flex flex-wrap gap-1">
        {(associate.skills || []).slice(0, 3).map((skill: string, index: number) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {skill}
          </span>
        ))}
        {(associate.skills || []).length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            +{(associate.skills || []).length - 3} more
          </span>
        )}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
      <div className="flex items-center text-sm text-gray-600">
        <Award className="h-4 w-4 mr-2" />
        {(associate.certifications || []).length > 0 ? (associate.certifications || [])[0] : 'None'}
        {(associate.certifications || []).length > 1 && ` (+${(associate.certifications || []).length - 1})`}
      </div>
    </div>
  </div>
);

export default AssociateCard;
