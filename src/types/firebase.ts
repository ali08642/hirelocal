export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
  savedBusinesses?: string[]; // Array of business IDs
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'assistant';
  metadata?: {
    businessContext?: string;
    category?: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  messages: ChatMessage[];
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  services: string[];
  location: BusinessLocation;
  saved: boolean;
  saveId?: string; // ID of the saved business entry
  // Required fields for saved businesses
  phone: string;
  address: string;
  // Optional fields
  contact?: any;
  rating?: string;
  hours?: any;
  photos?: any[];
  website?: string;
  reviews?: number;
  savedAt?: Date;
}

// Business location interface
export interface BusinessLocation {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
  id: string;
  name: string;
  description: string;
  category: string;
  services: string[];
  location: BusinessLocation;
  saved: boolean;
  // Make these optional since saved businesses might not have them
  contact?: any;
  rating?: string;
  hours?: any;
  photos?: any[];
  phone?: string;
  website?: string;
  reviews?: number;
  savedAt?: Date;
}

// Add other types if needed
export interface UserProfile {
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  radiusKm?: number;
  localeType?: string;
  notifications?: {
    emailUpdates?: boolean;
    providerReplies?: boolean;
    recommendations?: boolean;
    marketing?: boolean;
    security?: boolean;
  };
  privacy?: {
    showProfilePublic?: boolean;
    shareActivity?: boolean;
    aiPersonalization?: boolean;
    dataCollection?: boolean;
  };
}