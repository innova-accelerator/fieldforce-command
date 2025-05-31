import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockOrganizations, createOrganization } from '../data/mockData';
import { Organization } from '../types/organization';
import { Plus } from 'lucide-react';

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    category: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    additionalInfo: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    const newOrg = createOrganization(formData);
    setOrganizations([...organizations, newOrg]);
    setFormData({
      name: '',
      relation: '',
      category: '',
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      facebook: '',
      twitter: '',
      additionalInfo: '',
      address: '',
      city: '',
      state: '',
      zipcode: ''
    });
    setShowForm(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Organization</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Relation</label>
              <select
                value={formData.relation}
                onChange={(e) => handleInputChange('relation', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select relation</option>
                <option value="Client">Client</option>
                <option value="Partner">Partner</option>
                <option value="Vendor">Vendor</option>
                <option value="Competitor">Competitor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zipcode</label>
              <input
                type="text"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">Create Organization</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Relation</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>{org.relation || '-'}</TableCell>
                <TableCell>{org.category || '-'}</TableCell>
                <TableCell>{org.email || '-'}</TableCell>
                <TableCell>{org.phone || '-'}</TableCell>
                <TableCell>{org.city || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrganizationsPage;
