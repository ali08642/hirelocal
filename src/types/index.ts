// Types for the HireLocalGPT application

export interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  verified: boolean;
  responseTime: string;
  completedJobs: number;
  tags: string[];
  bio: string;
  gallery: string[];
  phone: string;
}

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  category: string;
  timestamp: Date;
  status: 'completed' | 'ongoing';
  messages: ChatMessage[];
}

export type ViewMode = 'list' | 'map';
export type Screen = 'landing' | 'auth' | 'dashboard' | 'chat' | 'results' | 'provider-detail' | 'history' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  profileImage: string;
  services: string[];
  responseTime: string;
  completedJobs: number;
  verified: boolean;
  available: boolean;
  phone: string;
  whatsapp: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  workingHours: {
    [key: string]: string;
  };
  specializations: string[];
}

export interface ChatHistoryItem extends ChatMessage {
  providerName: string;
  providerImage: string;
  lastMessage: string;
  unreadCount: number;
}
