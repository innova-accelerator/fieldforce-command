
import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, MapPin, Edit, Eye } from 'lucide-react';
import { mockCustomers } from '../data/mockData';
import { Customer } from '../types';

const CustomerManagement = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {customer.status}
            </span>
          </div>
          {customer.company && (
            <p className="text-sm text-gray-600 mt-1">{customer.company}</p>
          )}
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {customer.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {customer.phone}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {customer.address}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{customer.totalJobs}</span> total jobs
            </div>
            <div className="text-sm text-gray-500">
              Last contact: {customer.lastContact?.toLocaleDateString() || 'Never'}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setSelectedCustomer(customer)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const CustomerDetailsModal = ({ customer, onClose }: { customer: Customer; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
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
                  <p className="text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900">{customer.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{customer.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900 capitalize">{customer.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Jobs</label>
                  <p className="text-gray-900">{customer.totalJobs}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Since</label>
                  <p className="text-gray-900">{customer.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Contact</label>
                  <p className="text-gray-900">{customer.lastContact?.toLocaleDateString() || 'Never'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {customer.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found matching your search.</p>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
