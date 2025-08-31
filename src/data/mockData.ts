import { Provider, ChatSession, ChatHistoryItem } from '../types';

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Elite Electric Solutions',
    category: 'Electrician',
    rating: 4.9,
    distance: '2.5 km',
    image: 'https://images.pexels.com/photos/5691629/pexels-photo-5691629.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    responseTime: '< 1 hour',
    completedJobs: 150,
    tags: ['Emergency Service', 'Licensed', 'Insured'],
    bio: 'Professional electrical services with 15+ years of experience. Specializing in residential and commercial installations.',
    gallery: [
      'https://images.pexels.com/photos/5691629/pexels-photo-5691629.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    phone: '+1234567890'
  },
  {
    id: '2',
    name: 'Premium Plumbing Co.',
    category: 'Plumber',
    rating: 4.8,
    distance: '1.8 km',
    image: 'https://images.pexels.com/photos/8005392/pexels-photo-8005392.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
    responseTime: '< 30 min',
    completedJobs: 200,
    tags: ['24/7 Service', 'Licensed', 'Warranty'],
    bio: 'Expert plumbing services for all your residential and commercial needs. Quick response time guaranteed.',
    gallery: [
      'https://images.pexels.com/photos/8005392/pexels-photo-8005392.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    phone: '+1234567891'
  }
];

export const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Electrician for Kitchen Renovation',
    category: 'Electrician',
    timestamp: new Date(Date.now() - 86400000),
    status: 'completed',
    messages: []
  },
  {
    id: '2',
    title: 'Plumber for Bathroom Repair',
    category: 'Plumber',
    timestamp: new Date(Date.now() - 172800000),
    status: 'ongoing',
    messages: []
  }
];

export const mockChatHistory: ChatHistoryItem[] = [
  {
    id: '1',
    type: 'user',
    content: 'Thank you for the excellent service!',
    timestamp: new Date(Date.now() - 3600000),
    providerName: 'Elite Electric Solutions',
    providerImage: 'https://images.pexels.com/photos/5691629/pexels-photo-5691629.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Thank you for the excellent service!',
    unreadCount: 0
  },
  {
    id: '2',
    type: 'user',
    content: 'When can you come to fix the leak?',
    timestamp: new Date(Date.now() - 7200000),
    providerName: 'Premium Plumbing Co.',
    providerImage: 'https://images.pexels.com/photos/8005392/pexels-photo-8005392.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'I can be there in 30 minutes',
    unreadCount: 1
  }
];
