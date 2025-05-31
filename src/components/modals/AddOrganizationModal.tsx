
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus } from 'lucide-react';
import { organizationsApi, CreateOrganizationRequest } from '../../services/api/organizations';

interface AddOrganizationModalProps {
  onOrganizationAdded?: () => void;
}

const RELATION_OPTIONS = ['Unknown', 'Vendor', 'Partner', 'Other'] as const;
const CATEGORY_OPTIONS = ['Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Education', 'Retail', 'Other'];
const STATE_OPTIONS = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({ onOrganizationAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: '',
    relation: 'Unknown',
    category: '',
    email: '',
    cellNumber: '',
    officeNumber: '',
    phoneWithExtension: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await organizationsApi.create(formData);
      
      // Reset form
      setFormData({
        name: '',
        relation: 'Unknown',
        category: '',
        email: '',
        cellNumber: '',
        officeNumber: '',
        phoneWithExtension: '',
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
      
      setOpen(false);
      onOrganizationAdded?.();
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateOrganizationRequest, value: string) => {
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
          Add Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {errors.general && (
            <div className="md:col-span-2 p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Organization name"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Label htmlFor="relation">Relation *</Label>
            <Select onValueChange={(value) => handleInputChange('relation', value as any)} defaultValue="Unknown">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELATION_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="organization@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="cellNumber">Cell Number *</Label>
            <Input
              id="cellNumber"
              type="tel"
              required
              value={formData.cellNumber}
              onChange={(e) => handleInputChange('cellNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="officeNumber">Office Number *</Label>
            <Input
              id="officeNumber"
              type="tel"
              required
              value={formData.officeNumber}
              onChange={(e) => handleInputChange('officeNumber', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneWithExtension">Phone w/ Extension *</Label>
            <Input
              id="phoneWithExtension"
              type="tel"
              required
              value={formData.phoneWithExtension}
              onChange={(e) => handleInputChange('phoneWithExtension', e.target.value)}
              placeholder="(555) 123-4567 ext 123"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="website">Website *</Label>
            <Input
              id="website"
              type="url"
              required
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="linkedin">LinkedIn *</Label>
            <Input
              id="linkedin"
              required
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          
          <div>
            <Label htmlFor="facebook">Facebook *</Label>
            <Input
              id="facebook"
              required
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          
          <div>
            <Label htmlFor="twitter">Twitter *</Label>
            <Input
              id="twitter"
              required
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="additionalInfo">Additional Info *</Label>
            <Textarea
              id="additionalInfo"
              required
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Additional information..."
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>
          
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              required
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          
          <div>
            <Label htmlFor="state">State *</Label>
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
            <Label htmlFor="zipcode">Zip Code *</Label>
            <Input
              id="zipcode"
              required
              value={formData.zipcode}
              onChange={(e) => handleInputChange('zipcode', e.target.value)}
              placeholder="12345"
            />
          </div>
          
          <div className="md:col-span-2 flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Organization'}
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

export default AddOrganizationModal;
