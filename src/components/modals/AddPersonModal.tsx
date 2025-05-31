
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus } from 'lucide-react';
import { createPerson, mockOrganizations } from '../../data/mockData';

interface AddPersonModalProps {
  onPersonAdded?: () => void;
  defaultOrganizationId?: string;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ onPersonAdded, defaultOrganizationId }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    organizationId: defaultOrganizationId || '',
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    cellNumber: '',
    officeNumber: '',
    birthday: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationId || !formData.firstName || !formData.lastName || !formData.email) {
      alert('Organization, First Name, Last Name, and Email are required');
      return;
    }

    createPerson(formData);
    
    // Reset form
    setFormData({
      organizationId: defaultOrganizationId || '',
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      cellNumber: '',
      officeNumber: '',
      birthday: '',
      address: '',
      city: '',
      state: '',
      zipcode: ''
    });
    
    setOpen(false);
    onPersonAdded?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="organizationId">Organization *</Label>
            <Select 
              onValueChange={(value) => handleInputChange('organizationId', value)}
              defaultValue={defaultOrganizationId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {mockOrganizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Last name"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="person@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Job title"
            />
          </div>
          
          <div>
            <Label htmlFor="cellNumber">Cell Phone</Label>
            <Input
              id="cellNumber"
              type="tel"
              value={formData.cellNumber}
              onChange={(e) => handleInputChange('cellNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="officeNumber">Office Phone</Label>
            <Input
              id="officeNumber"
              type="tel"
              value={formData.officeNumber}
              onChange={(e) => handleInputChange('officeNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State"
            />
          </div>
          
          <div>
            <Label htmlFor="zipcode">Zip Code</Label>
            <Input
              id="zipcode"
              value={formData.zipcode}
              onChange={(e) => handleInputChange('zipcode', e.target.value)}
              placeholder="12345"
            />
          </div>
          
          <div className="md:col-span-2 flex gap-2 pt-4">
            <Button type="submit">Create Person</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonModal;
