
import { useState, useEffect } from 'react';
import { peopleApi, PersonResponse } from '@/services/api/people';

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
    try {
      const peopleData = await peopleApi.getAll();
      setPeople(peopleData);
    } catch (error) {
      console.error('Failed to fetch people:', error);
      setErrors({ general: 'Failed to load people' });
    } finally {
      setLoadingPeople(false);
    }
  };

  const handleClientChange = async (personId: string) => {
    setLoadingClient(true);
    try {
      const person = await peopleApi.getById(personId);
      setSelectedClient(person);
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
