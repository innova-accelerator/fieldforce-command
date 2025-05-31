
import React from 'react';
import { Star, Building } from 'lucide-react';

interface AssociateDetailsModalProps {
  associate: any;
  onClose: () => void;
}

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'available': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
    case 'busy': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
    case 'offline': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  }
};

const AssociateDetailsModal = ({ associate, onClose }: AssociateDetailsModalProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-[#212121] rounded-lg shadow-xl dark:shadow-none border dark:border-[#303030] max-w-2xl w-full max-h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200 dark:border-[#303030]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Associate Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-gray-100">{associate.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-gray-100">{associate.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <p className="text-gray-900 dark:text-gray-100">{associate.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                <p className="text-gray-900 dark:text-gray-100">{associate.location_address}</p>
              </div>
              {associate.organizations && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization</label>
                  <p className="text-blue-600 dark:text-blue-400">{associate.organizations.name}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Availability</label>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getAvailabilityColor(associate.availability)}`}>
                  {associate.availability}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Professional Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hourly Rate</label>
                <p className="text-gray-900 dark:text-gray-100">${associate.hourly_rate || 0}/hour</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</label>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-gray-900 dark:text-gray-100">{associate.rating || 0}/5.0</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Jobs</label>
                <p className="text-gray-900 dark:text-gray-100">{associate.completed_jobs || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</label>
                <p className="text-gray-900 dark:text-gray-100">{associate.joined_at ? new Date(associate.joined_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(associate.skills || []).map((skill: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full border dark:border-blue-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {(associate.certifications || []).map((cert: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full border dark:border-green-700">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssociateDetailsModal;
