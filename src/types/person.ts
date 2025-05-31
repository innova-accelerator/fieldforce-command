
export interface Person {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  birthday?: string;
  officeNumber?: string;
  cellNumber?: string;
  phoneAlt?: string;
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
