
export interface CreateOrganizationRequest {
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

export interface OrganizationResponse {
  id: string;
  name: string;
  relation: string;
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
  createdAt: string;
  updatedAt: string;
}

export const organizationsApi = {
  async getAll(): Promise<OrganizationResponse[]> {
    const response = await fetch('/api/organizations');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    return response.json();
  },

  async create(data: CreateOrganizationRequest): Promise<OrganizationResponse> {
    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create organization');
    }
    
    return response.json();
  },
};
