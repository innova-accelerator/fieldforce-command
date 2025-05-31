
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    joinDate: '2023-01-15',
    role: 'Field Manager',
    department: 'Operations'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-background dark:bg-[#171717] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#212121] rounded-lg shadow-sm dark:shadow-none border border-gray-200 dark:border-[#303030] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-blue-100">{profile.role}</p>
                  <p className="text-blue-200 text-sm">{profile.department}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">{profile.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">{profile.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 mt-1" />
                      {isEditing ? (
                        <textarea
                          value={editedProfile.address}
                          onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Work Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.role}
                        onChange={(e) => setEditedProfile({...editedProfile, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">{profile.role}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.department}
                        onChange={(e) => setEditedProfile({...editedProfile, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-[#303030] bg-white dark:bg-[#303030] text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">{profile.department}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Join Date</label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                      <p className="text-gray-900 dark:text-gray-100">{new Date(profile.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-[#303030] rounded-lg border dark:border-gray-600">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Completed job: HVAC Maintenance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-[#303030] rounded-lg border dark:border-gray-600">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Updated customer information</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-[#303030] rounded-lg border dark:border-gray-600">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Scheduled new appointment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#303030] flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#303030] hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center border dark:border-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
