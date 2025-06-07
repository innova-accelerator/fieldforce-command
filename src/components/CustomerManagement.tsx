
import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Building } from 'lucide-react';
import { useCustomers, useOrganizations } from '../hooks/useData';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import EditCustomerModal from './modals/EditCustomerModal';

const CustomerManagement = () => {
  const { data: customers = [], isLoading, refetch } = useCustomers();
  const { data: organizations = [] } = useOrganizations();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          user_id: user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          status: 'active'
        });

      if (insertError) throw insertError;

      // Reset form and close modal
      setFormData({ name: '', email: '', phone: '', company: '', address: '' });
      setShowModal(false);
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl border max-w-md w-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Add New Customer</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
