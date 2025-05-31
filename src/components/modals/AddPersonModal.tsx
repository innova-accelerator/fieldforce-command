
import React, { useState, useEffect } from 'react';
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus } from 'lucide-react';
import { peopleApi, CreatePersonRequest } from '../../services/api/people';
import { organizationsApi, OrganizationResponse } from '../../services/api/organizations';

interface AddPersonModalProps {
  onPersonAdded?: () => void;
  defaultOrganizationId?: string;
}

const STATE_OPTIONS = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const AddPersonModal: React.FC<AddPersonModalProps> = ({ onPersonAdded, defaultOrganizationId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [formData, setFormData] = useState<CreatePersonRequest>({
    organizationId: defaultOrganizationId || null,
    firstName: '',
    lastName: '',
    title: '',
    birthday: '',
    email: '',
    officeNumber: '',
    cellNumber: '',
    phoneWithExtension: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    additionalInfo: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });

  useEffect(() => {
    if (open) {
      fetchOrganizations();
    }
  }, [open]);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const orgs = await organizationsApi.getAll();
      setOrganizations(orgs);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      setErrors({ general: 'Failed to load organizations' });
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await peopleApi.create(formData);
      
      // Reset form
      setFormData({
        organizationId: defaultOrganizationId || null,
        firstName: '',
        lastName: '',
        title: '',
        birthday: '',
        email: '',
        officeNumber: '',
        cellNumber: '',
        phoneWithExtension: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        additionalInfo: '',
        address: '',
        city: '',
        state: '',
        zipcode: ''
      });
      
      setOpen(false);
      onPersonAdded?.();
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePersonRequest, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {errors.general && (
            <div className="md:col-span-2 p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="organizationId">Organization</Label>
            <Select 
              onValueChange={(value) => handleInputChange('organizationId', value === '—' ? null : value)}
              defaultValue={defaultOrganizationId || '—'}
              disabled={loadingOrgs}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingOrgs ? "Loading..." : "Select organization"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="—">— No Organization —</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="First name"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Last name"
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
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="person@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="officeNumber">Office Number</Label>
            <Input
              id="officeNumber"
              type="tel"
              value={formData.officeNumber}
              onChange={(e) => handleInputChange('officeNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="cellNumber">Cell Number</Label>
            <Input
              id="cellNumber"
              type="tel"
              value={formData.cellNumber}
              onChange={(e) => handleInputChange('cellNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneWithExtension">Phone w/ Extension</Label>
            <Input
              id="phoneWithExtension"
              type="tel"
              value={formData.phoneWithExtension}
              onChange={(e) => handleInputChange('phoneWithExtension', e.target.value)}
              placeholder="(555) 123-4567 ext 123"
            />
          </div>
          
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="additionalInfo">Additional Info</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Additional information..."
              rows={3}
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
            <Select onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATE_OPTIONS.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Person'}
            </Button>
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
