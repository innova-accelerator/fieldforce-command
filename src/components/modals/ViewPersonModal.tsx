
import React from 'react';
import { X, User, Mail, Phone, Building, MapPin, Calendar, Globe, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ViewPersonModalProps {
  person: any;
  onClose: () => void;
  onEdit: () => void;
}

const ViewPersonModal: React.FC<ViewPersonModalProps> = ({ person, onClose, onEdit }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-black/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Person Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Header with name and photo */}
          <div className="flex items-start mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {person.first_name} {person.last_name}
              </h3>
              {person.title && (
                <p className="text-lg text-gray-600 dark:text-gray-400">{person.title}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Contact Information</h4>
              <div className="space-y-3">
                {person.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <a href={`mailto:${person.email}`} className="text-blue-600 hover:underline">
                      {person.email}
                    </a>
                  </div>
                )}
                {person.cell_number && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <a href={`tel:${person.cell_number}`} className="text-blue-600 hover:underline">
                      {person.cell_number}
                    </a>
                  </div>
                )}
                {person.office_number && (
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Office: {person.office_number}</span>
                  </div>
                )}
                {person.phone_alt && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Alt: {person.phone_alt}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Personal Information</h4>
              <div className="space-y-3">
                {person.birthday && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(person.birthday).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {person.organizations?.name && (
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">{person.organizations.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          {(person.address || person.city || person.state || person.zipcode) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Address</h4>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div className="text-gray-600 dark:text-gray-400">
                  {person.address && <div>{person.address}</div>}
                  <div>
                    {[person.city, person.state, person.zipcode].filter(Boolean).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          {(person.linkedin || person.facebook || person.twitter) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Social Media</h4>
              <div className="space-y-3">
                {person.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="h-5 w-5 text-gray-400 mr-3" />
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {person.facebook && (
                  <div className="flex items-center">
                    <Facebook className="h-5 w-5 text-gray-400 mr-3" />
                    <a href={person.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Facebook Profile
                    </a>
                  </div>
                )}
                {person.twitter && (
                  <div className="flex items-center">
                    <Twitter className="h-5 w-5 text-gray-400 mr-3" />
                    <a href={person.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Twitter Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {person.additional_info && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Additional Information</h4>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{person.additional_info}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onEdit}
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Edit Person
            </button>
            <button
              onClick={onClose}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPersonModal;
