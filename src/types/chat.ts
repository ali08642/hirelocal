import { Business } from './firebase';

export interface ServiceProvider {
  id: string;
  name: string;
  address: string;
  phone: string;
  details?: string;
  location_note?: 'EXACT' | 'NEARBY';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  providers?: ServiceProvider[];
  businesses?: Business[];
}
