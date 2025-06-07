
import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Building } from 'lucide-react';
import { useCustomers, useOrganizations } from '../hooks/useData';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import EditCustomerModal from './modals/EditCustomerModal';
import AddUnifiedOrganizationModal from './modals/AddUnifiedOrganizationModal';

const CustomerManagement = () => {
  const { data: customers = [], isLoading, refetch } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState<any | null>(null);
  const { user } = useAuth();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOrganizationAdded = () => {
    refetch();
    setShowModal(false);
  };

  const handleCustomerUpdated = () => {
    refetch();
    setSelectedCustomerForEdit(null);
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomerForEdit(customer);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-foreground">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">{customer.name}</h3>
                {customer.company && (
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Building className="h-4 w-4 mr-1" />
                    {customer.company}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {customer.phone}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-end space-x-2">
              <button 
                onClick={() => handleEdit(customer)}
                className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
              >
                Edit
              </button>
              <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No customers found matching your criteria.</p>
        </div>
      )}

      {/* Add Customer Modal */}
      <AddUnifiedOrganizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onOrganizationAdded={handleOrganizationAdded}
        defaultClassification="customer"
      />

      {/* Edit Customer Modal */}
      {selectedCustomerForEdit && (
        <EditCustomerModal
          customer={selectedCustomerForEdit}
          onClose={() => setSelectedCustomerForEdit(null)}
          onCustomerUpdated={handleCustomerUpdated}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
