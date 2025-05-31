
import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Star, Award, Clock } from 'lucide-react';
import { useAssociates } from '../hooks/useData';

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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const AssociateCard = ({ associate }: { associate: any }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedAssociate(associate)}
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

  const AssociateDetailsModal = ({ associate, onClose }: { associate: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Associate Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{associate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{associate.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{associate.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{associate.location_address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Availability</label>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getAvailabilityColor(associate.availability)}`}>
                    {associate.availability}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
                  <p className="text-gray-900">${associate.hourly_rate || 0}/hour</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Rating</label>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-gray-900">{associate.rating || 0}/5.0</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Completed Jobs</label>
                  <p className="text-gray-900">{associate.completed_jobs || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Joined</label>
                  <p className="text-gray-900">{associate.joined_at ? new Date(associate.joined_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(associate.skills || []).map((skill: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {(associate.certifications || []).map((cert: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search associates by name, skills, or certifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Associates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssociates.map((associate) => (
          <AssociateCard key={associate.id} associate={associate} />
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
