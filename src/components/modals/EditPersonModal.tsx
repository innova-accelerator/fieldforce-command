
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
import { supabase } from '../../integrations/supabase/client';

interface EditPersonModalProps {
  person: any;
  onClose: () => void;
  onPersonUpdated: () => void;
}

const STATE_OPTIONS = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const EditPersonModal: React.FC<EditPersonModalProps> = ({ person, onClose, onPersonUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    organizationId: person.organization_id || null,
    firstName: person.first_name || '',
    lastName: person.last_name || '',
    title: person.title || '',
    birthday: person.birthday || '',
    email: person.email || '',
    officeNumber: person.office_number || '',
    cellNumber: person.cell_number || '',
    phoneWithExtension: person.phone_alt || '',
    linkedin: person.linkedin || '',
    facebook: person.facebook || '',
    twitter: person.twitter || '',
    additionalInfo: person.additional_info || '',
    address: person.address || '',
    city: person.city || '',
    state: person.state || '',
    zipcode: person.zipcode || ''
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    setErrors({});
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrors({ general: 'User not authenticated. Please log in.' });
        return;
      }

      const { data: organizations, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch organizations:', error);
        setErrors({ general: 'Failed to load organizations: ' + error.message });
        return;
      }

      setOrganizations(organizations || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setErrors({ general: 'Failed to load organizations. Please try again.' });
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('people')
        .update({
          organization_id: formData.organizationId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          title: formData.title,
          birthday: formData.birthday || null,
          email: formData.email,
          office_number: formData.officeNumber,
          cell_number: formData.cellNumber,
          phone_alt: formData.phoneWithExtension,
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          twitter: formData.twitter,
          additional_info: formData.additionalInfo,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode
        })
        .eq('id', person.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to update person:', error);
        throw new Error(error.message);
      }

      console.log('Person updated successfully:', data);
      onPersonUpdated();
    } catch (error) {
      console.error('Error updating person:', error);
      if (error instanceof Error) {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-black/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Edit Person</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 text-sm text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="organizationId" className="text-gray-900 dark:text-gray-100">Organization</Label>
              <Select 
                onValueChange={(value) => handleInputChange('organizationId', value === '—' ? null : value)}
                defaultValue={formData.organizationId || '—'}
                disabled={loadingOrgs}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={loadingOrgs ? "Loading organizations..." : "Select organization"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="—" className="text-gray-900 dark:text-gray-100">— No Organization —</SelectItem>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id} className="text-gray-900 dark:text-gray-100">
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="firstName" className="text-gray-900 dark:text-gray-100">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First name"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-gray-900 dark:text-gray-100">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last name"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="title" className="text-gray-900 dark:text-gray-100">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Job title"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="birthday" className="text-gray-900 dark:text-gray-100">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="person@example.com"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="officeNumber" className="text-gray-900 dark:text-gray-100">Office Number</Label>
              <Input
                id="officeNumber"
                type="tel"
                value={formData.officeNumber}
                onChange={(e) => handleInputChange('officeNumber', e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="cellNumber" className="text-gray-900 dark:text-gray-100">Cell Number</Label>
              <Input
                id="cellNumber"
                type="tel"
                value={formData.cellNumber}
                onChange={(e) => handleInputChange('cellNumber', e.target.value)}
                placeholder="(555) 123-4567"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="phoneWithExtension" className="text-gray-900 dark:text-gray-100">Phone w/ Extension</Label>
              <Input
                id="phoneWithExtension"
                type="tel"
                value={formData.phoneWithExtension}
                onChange={(e) => handleInputChange('phoneWithExtension', e.target.value)}
                placeholder="(555) 123-4567 ext 123"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="linkedin" className="text-gray-900 dark:text-gray-100">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="facebook" className="text-gray-900 dark:text-gray-100">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="twitter" className="text-gray-900 dark:text-gray-100">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                placeholder="https://twitter.com/..."
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="additionalInfo" className="text-gray-900 dark:text-gray-100">Additional Info</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Additional information..."
                rows={3}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-gray-900 dark:text-gray-100">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="city" className="text-gray-900 dark:text-gray-100">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="state" className="text-gray-900 dark:text-gray-100">State</Label>
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
              <Label htmlFor="zipcode" className="text-gray-900 dark:text-gray-100">Zip Code</Label>
              <Input
                id="zipcode"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                placeholder="12345"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Person'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPersonModal;
