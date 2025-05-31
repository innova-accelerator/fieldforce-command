
export interface CreatePersonRequest {
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
}

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

export const peopleApi = {
  async getAll(): Promise<PersonResponse[]> {
    const response = await fetch('/api/people');
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    return response.json();
  },

  async getById(id: string): Promise<PersonResponse> {
    const response = await fetch(`/api/people/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch person');
    }
    return response.json();
  },

  async create(data: CreatePersonRequest): Promise<PersonResponse> {
    const response = await fetch('/api/people', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create person');
    }
    
    return response.json();
  },
};
