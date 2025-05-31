
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PersonResponse {
  id: string;
  organizationId: string | null;
  firstName: string;
  lastName: string;
  title: string;
  birthday: string;
  email: string;
  officeNumber: string;
  cellNumber: string;
  phoneWithExtension: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  additionalInfo: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  createdAt: string;
  updatedAt: string;
}

export const usePeopleData = () => {
  const [people, setPeople] = useState<PersonResponse[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<PersonResponse[]>([]);
  const [selectedClient, setSelectedClient] = useState<PersonResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      const filtered = people.filter(person => 
        person.organizationId === selectedClient.organizationId
      );
      setFilteredPeople(filtered);
    } else {
      setFilteredPeople([]);
    }
  }, [selectedClient, people]);

  const fetchPeople = async () => {
    setLoadingPeople(true);
    setErrors({});
    try {
      console.log('Fetching people from Supabase...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        setErrors({ general: 'User not authenticated' });
        return;
      }

      const { data: peopleData, error } = await supabase
        .from('people')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch people:', error);
        setErrors({ general: 'Failed to load people: ' + error.message });
        return;
      }

      console.log('People fetched successfully:', peopleData);
      
      // Transform the data to match the expected interface
      const transformedPeople = (peopleData || []).map(person => ({
        id: person.id,
        organizationId: person.organization_id,
        firstName: person.first_name,
        lastName: person.last_name,
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
        zipcode: person.zipcode || '',
        createdAt: person.created_at,
        updatedAt: person.updated_at
      }));
      
      setPeople(transformedPeople);
    } catch (error) {
      console.error('Error fetching people:', error);
      setErrors({ general: 'Failed to load people' });
    } finally {
      setLoadingPeople(false);
    }
  };

  const handleClientChange = async (personId: string) => {
    setLoadingClient(true);
    setErrors({});
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: person, error } = await supabase
        .from('people')
        .select('*')
        .eq('id', personId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch client data:', error);
        setErrors({ client: 'Failed to load client data: ' + error.message });
        return;
      }

      // Transform the data to match the expected interface
      const transformedPerson = {
        id: person.id,
        organizationId: person.organization_id,
        firstName: person.first_name,
        lastName: person.last_name,
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
        zipcode: person.zipcode || '',
        createdAt: person.created_at,
        updatedAt: person.updated_at
      };

      setSelectedClient(transformedPerson);
    } catch (error) {
      console.error('Failed to fetch client data:', error);
      setErrors({ client: 'Failed to load client data' });
    } finally {
      setLoadingClient(false);
    }
  };

  return {
    people,
    loadingPeople,
    loadingClient,
    filteredPeople,
    selectedClient,
    errors,
    handleClientChange
  };
};
