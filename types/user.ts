export interface Profile {
  id: null | string;
  name: string;
  email: string;
  avatar: string;
  description: string;
  address: string;
  phone: string;
  socials: Array<string>;
  createdAt?: string;
  updatedAt?: string;
}
