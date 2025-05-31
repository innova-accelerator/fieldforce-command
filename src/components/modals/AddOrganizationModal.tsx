
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
import { supabase } from '../../integrations/supabase/client';

interface AddOrganizationModalProps {
  onOrganizationAdded?: () => void;
}

interface CreateOrganizationRequest {
  name: string;
  relation: 'Unknown' | 'Vendor' | 'Partner' | 'Other';
  category: string;
  email: string;
  cellNumber: string;
  officeNumber: string;
  phoneWithExtension: string;
  website: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  additionalInfo: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
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
      console.log('Creating organization with data:', formData);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('organizations')
        .insert({
          user_id: user.id,
          name: formData.name,
          relation: formData.relation,
          category: formData.category,
          email: formData.email,
          phone: formData.cellNumber, // Map cellNumber to phone field
          website: formData.website,
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          twitter: formData.twitter,
          additional_info: formData.additionalInfo,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create organization:', error);
        throw new Error(error.message);
      }

      console.log('Organization created successfully:', data);
      
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
      console.error('Error creating organization:', error);
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
        <Button size="sm" className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Add New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {errors.general && (
            <div className="md:col-span-2 p-3 text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Organization name"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <Label htmlFor="relation" className="text-gray-900 dark:text-gray-100">Relation *</Label>
            <Select onValueChange={(value) => handleInputChange('relation', value as any)} defaultValue="Unknown">
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {RELATION_OPTIONS.map(option => (
                  <SelectItem key={option} value={option} className="text-gray-900 dark:text-gray-100">{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category" className="text-gray-900 dark:text-gray-100">Category *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option} value={option} className="text-gray-900 dark:text-gray-100">{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="organization@example.com"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="cellNumber" className="text-gray-900 dark:text-gray-100">Cell Number *</Label>
            <Input
              id="cellNumber"
              type="tel"
              required
              value={formData.cellNumber}
              onChange={(e) => handleInputChange('cellNumber', e.target.value)}
              placeholder="(555) 123-4567"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="officeNumber" className="text-gray-900 dark:text-gray-100">Office Number *</Label>
            <Input
              id="officeNumber"
              type="tel"
              required
              value={formData.officeNumber}
              onChange={(e) => handleInputChange('officeNumber', e.target.value)}
              placeholder="(555) 123-4567"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneWithExtension" className="text-gray-900 dark:text-gray-100">Phone w/ Extension *</Label>
            <Input
              id="phoneWithExtension"
              type="tel"
              required
              value={formData.phoneWithExtension}
              onChange={(e) => handleInputChange('phoneWithExtension', e.target.value)}
              placeholder="(555) 123-4567 ext 123"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="website" className="text-gray-900 dark:text-gray-100">Website *</Label>
            <Input
              id="website"
              type="url"
              required
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="linkedin" className="text-gray-900 dark:text-gray-100">LinkedIn *</Label>
            <Input
              id="linkedin"
              required
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="facebook" className="text-gray-900 dark:text-gray-100">Facebook *</Label>
            <Input
              id="facebook"
              required
              value={formData.facebook}
              onChange={(e) => handleInputChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="twitter" className="text-gray-900 dark:text-gray-100">Twitter *</Label>
            <Input
              id="twitter"
              required
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="additionalInfo" className="text-gray-900 dark:text-gray-100">Additional Info *</Label>
            <Textarea
              id="additionalInfo"
              required
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Additional information..."
              rows={3}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="address" className="text-gray-900 dark:text-gray-100">Address *</Label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="city" className="text-gray-900 dark:text-gray-100">City *</Label>
            <Input
              id="city"
              required
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <Label htmlFor="state" className="text-gray-900 dark:text-gray-100">State *</Label>
            <Select onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {STATE_OPTIONS.map(state => (
                  <SelectItem key={state} value={state} className="text-gray-900 dark:text-gray-100">{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="zipcode" className="text-gray-900 dark:text-gray-100">Zip Code *</Label>
            <Input
              id="zipcode"
              required
              value={formData.zipcode}
              onChange={(e) => handleInputChange('zipcode', e.target.value)}
              placeholder="12345"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
          
          <div className="md:col-span-2 flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white">
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationModal;
