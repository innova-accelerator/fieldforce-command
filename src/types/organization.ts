
export interface Organization {
  id: string;
  name: string;
  relation?: string;
  category?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  additionalInfo?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  createdAt: Date;
}
