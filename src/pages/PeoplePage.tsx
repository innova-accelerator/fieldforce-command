import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockPeople, mockOrganizations, createPerson, getOrganizationById } from '../data/mockData';
import { Person } from '../types/person';
import { Plus } from 'lucide-react';

const PeoplePage = () => {
  const [currentPage, setCurrentPage] = useState('people');
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [showForm, setShowForm] = useState(false);
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [formData, setFormData] = useState({
    organizationId: '',
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    birthday: '',
    officeNumber: '',
    cellNumber: '',
    phoneAlt: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    additionalInfo: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const filteredPeople = organizationFilter 
    ? people.filter(person => person.organizationId === organizationFilter)
    : people;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationId || !formData.firstName || !formData.lastName || !formData.email) {
      alert('Organization, First Name, Last Name, and Email are required');
      return;
    }

    const newPerson = createPerson(formData);
    setPeople([...people, newPerson]);
    setFormData({
      organizationId: '',
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      birthday: '',
      officeNumber: '',
      cellNumber: '',
      phoneAlt: '',
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
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">People</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        </div>

        <div className="mb-4">
          <select
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Organizations</option>
            {mockOrganizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h2 className="text-lg font-semibold mb-4">Add New Person</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organization *</label>
                <select
                  required
                  value={formData.organizationId}
                  onChange={(e) => handleInputChange('organizationId', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select organization</option>
                  {mockOrganizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cell Number</label>
                <input
                  type="tel"
                  value={formData.cellNumber}
                  onChange={(e) => handleInputChange('cellNumber', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Create Person</Button>
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
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeople.map((person) => {
                const organization = getOrganizationById(person.organizationId);
                return (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.firstName}</TableCell>
                    <TableCell>{person.lastName}</TableCell>
                    <TableCell>{person.title || '-'}</TableCell>
                    <TableCell>{person.email}</TableCell>
                    <TableCell>{organization?.name || '-'}</TableCell>
                    <TableCell>{person.cellNumber || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default PeoplePage;
