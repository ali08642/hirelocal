import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Loader2, User, Bot, Phone, Wrench, Zap, Droplets, Home, Car, Scissors, Search, MessageCircle, Shield, CheckCircle2, Copy, Navigation, ChevronDown, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  providers?: ServiceProvider[];
}

import { Business } from '../types/firebase';
import { BusinessCard } from './BusinessCard';
import { BusinessService } from '../services/BusinessService';
import { useAuth } from '../contexts/AuthContextHooks';

const SimpleChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [processingStage, setProcessingStage] = useState<'thinking' | 'searching' | 'organizing' | 'complete'>('complete');
  const [showLocationSkeleton, setShowLocationSkeleton] = useState(false);
  const [locationLoadingState, setLocationLoadingState] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{area: string, city: string, state?: string, country: string, fullAddress: string} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showCardSkeletons, setShowCardSkeletons] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreMessage, setLoadingMoreMessage] = useState('');
  const [conversationState, setConversationState] = useState<'initial' | 'awaiting_service' | 'awaiting_location' | 'complete'>('initial');
  const [locationPermissionState, setLocationPermissionState] = useState<'asking' | 'granted' | 'denied' | 'unavailable'>('asking');
  const [nearbyCities, setNearbyCities] = useState<{id: string, name: string}[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const { user } = useAuth();

const handleToggleSave = async (businessId: string) => {
  if (!user) return;

  try {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    if (business.saved && business.saveId) {
      await BusinessService.unsaveBusiness(user.uid, business.saveId);
      setBusinesses(prev =>
        prev.map(b =>
          b.id === businessId ? { ...b, saved: false, saveId: undefined } : b
        )
      );
    } else {
      const saveId = await BusinessService.saveBusiness(user.uid, business);
      setBusinesses(prev =>
        prev.map(b =>
          b.id === businessId ? { ...b, saved: true, saveId } : b
        )
      );
    }
  } catch (error) {
    console.error('Error toggling business save:', error);
  }
};

const loadSavedStatus = useCallback(async () => {
  if (!user) return;
  
  try {
    const savedBusinesses = await BusinessService.getSavedBusinesses(user.uid);
    
    setBusinesses(prevBusinesses => 
      prevBusinesses.map(business => {
        const savedBusiness = savedBusinesses.find(saved => 
          saved.name === business.name && 
          JSON.stringify(saved.location) === JSON.stringify(business.location)
        );
        
        if (savedBusiness) {
          return {
            ...business,
            saved: true,
            saveId: savedBusiness.id
          };
        }
        return { ...business, saved: false, saveId: undefined };
      })
    );
  } catch (error) {
    console.error('Error loading saved businesses:', error);
  }
}, [user]);

  const processingTimeoutsRef = useRef<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialMessageAdded = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = messagesEndRef.current;
    if (!el) return;
    
    // Use requestAnimationFrame for smoother scrolling and avoid timing issues with layout/animations
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'end' as ScrollLogicalPosition });
        } catch (e) {
          // fallback
          el.scrollIntoView(false);
        }
      });
    });
  }, []);

  const toggleExpandedCard = useCallback((index: number) => {
    setExpandedCard(prev => (prev === index ? null : index));
    
    // Smooth scroll to card after animation with optimized timing
    window.requestAnimationFrame(() => {
      const selector = `[data-provider-index="${index}"]`;
      const el = document.querySelector(selector) as HTMLElement | null;
      
      if (el) {
        const t1 = window.setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
        processingTimeoutsRef.current.push(t1);
      } else {
        const t1 = window.setTimeout(() => scrollToBottom(), 150);
        processingTimeoutsRef.current.push(t1);
      }
    });
  }, [scrollToBottom]);

  useEffect(() => {
    // Optimized scroll timing for smoother animations
    const id = window.setTimeout(() => scrollToBottom(), 120);
    return () => clearTimeout(id);
  }, [messages, isTyping, scrollToBottom]);

  // Keep view scrolled when processing stage or skeleton/loading changes
  useEffect(() => {
    // Debounced scroll for better performance
    const id = window.setTimeout(() => scrollToBottom(), 300);
    return () => clearTimeout(id);
  }, [processingStage, showCardSkeletons, loadingMore, scrollToBottom]);

  const addMessage = useCallback((type: 'user' | 'ai', content: string, options: { providers?: ServiceProvider[], businesses?: Business[] } = {}) => {
    const newMessage: Message = {
      id: Date.now().toString() + (Math.random().toString(36).substring(7)),
      type,
      content,
      timestamp: new Date(),
      providers: options.providers,
      businesses: options.businesses
    };
    setMessages(prev => [...prev, newMessage]);

    if (options.businesses) {
      setBusinesses(options.businesses.map(business => ({
        ...business,
        saved: false // Initially all businesses are unsaved
      })));
      loadSavedStatus(); // Load saved status for the new businesses
    }
  }, [loadSavedStatus]);

  const serviceOptions = [
    { id: 'plumber', name: 'Plumber', icon: Droplets },
    { id: 'electrician', name: 'Electrician', icon: Zap },
    { id: 'handyman', name: 'Handyman', icon: Wrench },
    { id: 'cleaner', name: 'Cleaner', icon: Home },
    { id: 'mechanic', name: 'Mechanic', icon: Car },
    { id: 'barber', name: 'Barber', icon: Scissors }
  ];

  // Dynamic location options based on user's region
  const getLocationOptions = () => {
    let nearMeText = 'Near Me';
    if (locationPermissionState === 'denied') {
      nearMeText = 'Try Location Access';
    } else if (locationPermissionState === 'unavailable') {
      nearMeText = 'Retry Location';
    }
    
    const baseOptions = [{ id: 'near-me', name: nearMeText, icon: Navigation }];
    
    if (locationPermissionState === 'denied' || locationPermissionState === 'unavailable') {
      // Show "Try Location Access" + some major cities as fallback options
      return [
        ...baseOptions,
        { id: 'new-york', name: 'New York' },
        { id: 'los-angeles', name: 'Los Angeles' },
        { id: 'chicago', name: 'Chicago' },
        { id: 'houston', name: 'Houston' }
      ];
    }
    
    // If we have nearby cities, show them
    if (nearbyCities.length > 0) {
      return [...baseOptions, ...nearbyCities];
    }
    
    // Default fallback cities (will be replaced by dynamic ones)
    return [
      ...baseOptions,
      { id: 'new-york', name: 'New York' },
      { id: 'los-angeles', name: 'Los Angeles' },
      { id: 'chicago', name: 'Chicago' },
      { id: 'houston', name: 'Houston' }
    ];
  };

  // Get user's precise geolocation with reverse geocoding
  const getUserLocation = async (): Promise<{area: string, city: string, state?: string, country: string, fullAddress: string} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('Got coordinates:', { latitude, longitude });
            
            // Use Nominatim (OpenStreetMap) reverse geocoding service - it's free and reliable
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`,
              {
                headers: {
                  'User-Agent': 'ServiceGPT-Location-Service/1.0'
                }
              }
            );
            
            if (!response.ok) {
              throw new Error(`Geocoding failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Geocoding response:', data);
            
            const address = data.address;
            
            if (!address) {
              throw new Error('No address found in response');
            }
            
            // Extract detailed location information with comprehensive fallbacks
            const area = address.suburb || 
                        address.neighbourhood || 
                        address.residential || 
                        address.quarter || 
                        address.district || 
                        address.hamlet || 
                        address.village || 
                        address.locality ||
                        '';
                        
            const city = address.city || 
                        address.town || 
                        address.municipality || 
                        address.county ||
                        '';
                        
            const state = address.state || 
                         address.province || 
                         address.region ||
                         '';
                         
            const country = address.country ||
                           '';
            
            let finalArea = area;
            let finalCity = city;
            
            // If we don't have area/city, parse from display_name
            if (!area && !city && data.display_name) {
              const parts = data.display_name.split(',').map(part => part.trim());
              finalArea = parts[0] || 'your area';
              finalCity = parts[1] || 'your location';
            } else if (!area && city) {
              // Use city as area if no specific area found
              finalArea = city;
            } else if (area && !city) {
              // Use area as city if no city found
              finalCity = area;
            }
            
            // Ensure we have meaningful values
            if (!finalArea) finalArea = 'your area';
            if (!finalCity) finalCity = 'your location';
            
            // Build full address
            const addressParts = [];
            if (finalArea && finalArea !== 'your area') addressParts.push(finalArea);
            if (finalCity && finalCity !== finalArea && finalCity !== 'your location') addressParts.push(finalCity);
            if (state) addressParts.push(state);
            if (country) addressParts.push(country);
            
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'your area';
            
            console.log('Parsed location:', {
              area: finalArea,
              city: finalCity,
              state,
              country,
              fullAddress
            });
            
            resolve({
              area: finalArea,
              city: finalCity,
              state: state || undefined,
              country: country || 'unknown',
              fullAddress
            });
            
          } catch (error) {
            console.error('Geocoding error:', error);
            
            // Fallback: try simpler geocoding
            try {
              const { latitude, longitude } = position.coords;
              const simpleResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=12`,
                {
                  headers: {
                    'User-Agent': 'ServiceGPT-Location-Service/1.0'
                  }
                }
              );
              
              if (simpleResponse.ok) {
                const simpleData = await simpleResponse.json();
                const displayName = simpleData.display_name;
                
                if (displayName) {
                  const parts = displayName.split(',').map(part => part.trim());
                  const area = parts[0] || 'your area';
                  const city = parts[1] || parts[0] || 'your location';
                  
                  resolve({
                    area,
                    city: city !== area ? city : 'your location',
                    country: 'unknown',
                    fullAddress: parts.slice(0, 2).join(', ') || area
                  });
                  return;
                }
              }
            } catch (fallbackError) {
              console.error('Fallback geocoding failed:', fallbackError);
            }
            
            // Final coordinate-based fallback
            console.warn('Using coordinate-based location');
            resolve({
              area: 'your area',
              city: 'your location',
              country: 'unknown',
              fullAddress: 'your current location'
            });
          }
        },
        (error) => {
          console.error('Geolocation permission error:', error);
          
          // Set permission state based on error type
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermissionState('denied');
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setLocationPermissionState('unavailable');
          }
          
          resolve(null);
        },
        {
          timeout: 15000,
          enableHighAccuracy: true,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    });
  };

  // Get nearby cities based on user's location
  const getNearbyCities = async (userCoords: {latitude: number, longitude: number}): Promise<{id: string, name: string}[]> => {
    try {
      // Get nearby cities using Nominatim search with expanded radius
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&dedupe=1&extratags=1` +
        `&bounded=1&viewbox=${userCoords.longitude-0.5},${userCoords.latitude+0.5},${userCoords.longitude+0.5},${userCoords.latitude-0.5}` +
        `&q=city&accept-language=en`,
        {
          headers: {
            'User-Agent': 'ServiceGPT-Location-Service/1.0'
          }
        }
      );
      
      if (!response.ok) return [];
      
      const data = await response.json();
      console.log('Nearby cities response:', data);
      
      const cities = data
        .filter((place: any) => {
          // Filter for cities, towns, and municipalities
          const placeType = place.type;
          const category = place.class;
          return (placeType === 'city' || placeType === 'town' || placeType === 'administrative') &&
                 place.display_name && 
                 place.address?.city || place.address?.town || place.address?.municipality;
        })
        .map((place: any) => ({
          id: place.place_id.toString(),
          name: place.address?.city || place.address?.town || place.address?.municipality || place.display_name.split(',')[0]
        }))
        .filter((city: any, index: number, self: any[]) => 
          // Remove duplicates
          index === self.findIndex(c => c.name === city.name)
        )
        .slice(0, 6); // Limit to 6 cities
      
      console.log('Processed nearby cities:', cities);
      return cities;
    } catch (error) {
      console.error('Error fetching nearby cities:', error);
      return [];
    }
  };

  // Initialize location permission and setup
  const initializeLocationServices = async () => {
    console.log('Initializing location services...');
    
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      setLocationPermissionState('unavailable');
      setIsInitializing(false);
      return;
    }

    try {
      // Check if we already have permission
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        console.log('Current permission state:', permission.state);
        
        if (permission.state === 'granted') {
          // We have permission, but don't auto-request to avoid violations
          console.log('Permission already granted, will get location on user request');
          setLocationPermissionState('granted');
          setIsInitializing(false);
          return;
        } else if (permission.state === 'denied') {
          console.log('Permission previously denied');
          setLocationPermissionState('denied');
          setIsInitializing(false);
          return;
        }
      }
      
      // Permission state is 'prompt' or unknown, will request on user interaction
      console.log('Location permission needs to be requested by user interaction');
      setLocationPermissionState('asking');
      setIsInitializing(false);
      
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationPermissionState('denied');
      setIsInitializing(false);
    }
  };

  // Request location access and get nearby cities
  const requestLocationAccess = async () => {
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Location access granted!');
          setLocationPermissionState('granted');
          
          try {
            // Get user's detailed location
            const detectedLocation = await getUserLocationFromCoords(position.coords);
            if (detectedLocation) {
              setUserLocation(detectedLocation);
              console.log('User location set:', detectedLocation);
            }
            
            // Get nearby cities for suggestions
            const cities = await getNearbyCities({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            
            if (cities.length > 0) {
              setNearbyCities(cities);
              console.log('Nearby cities set:', cities);
            }
            
          } catch (error) {
            console.error('Error processing location:', error);
          }
          
          setIsInitializing(false);
          resolve();
        },
        (error) => {
          console.log('Location access denied or failed:', error);
          setLocationPermissionState('denied');
          setIsInitializing(false);
          resolve();
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    });
  };

  // Separate function to get location from coordinates (for reuse)
  const getUserLocationFromCoords = async (coords: GeolocationCoordinates): Promise<{area: string, city: string, state?: string, country: string, fullAddress: string} | null> => {
    try {
      const { latitude, longitude } = coords;
      console.log('Getting location from coords:', { latitude, longitude });
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`,
        {
          headers: {
            'User-Agent': 'ServiceGPT-Location-Service/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
      
      const data = await response.json();
      const address = data.address;
      
      if (!address) throw new Error('No address found');
      
      const area = address.suburb || address.neighbourhood || address.residential || address.quarter || address.district || address.hamlet || address.village || address.locality || '';
      const city = address.city || address.town || address.municipality || address.county || '';
      const state = address.state || address.province || address.region || '';
      const country = address.country || '';
      
      let finalArea = area || 'your area';
      let finalCity = city || 'your location';
      
      if (!area && !city && data.display_name) {
        const parts = data.display_name.split(',').map((part: string) => part.trim());
        finalArea = parts[0] || 'your area';
        finalCity = parts[1] || 'your location';
      }
      
      const addressParts = [];
      if (finalArea && finalArea !== 'your area') addressParts.push(finalArea);
      if (finalCity && finalCity !== finalArea && finalCity !== 'your location') addressParts.push(finalCity);
      if (state) addressParts.push(state);
      if (country) addressParts.push(country);
      
      const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'your area';
      
      return {
        area: finalArea,
        city: finalCity,
        state: state || undefined,
        country: country || 'unknown',
        fullAddress
      };
      
    } catch (error) {
      console.error('Error getting location from coordinates:', error);
      return null;
    }
  };

  // Handle "near me" response when typed manually
  const handleNearMeResponse = async () => {
    setLocationLoading(true);
    addMessage('user', 'Near me');
    
    // Show processing message
    setIsTyping(true);
    setProcessingStage('thinking');
    setTimeout(() => setProcessingStage('searching'), 500);
    
    const detectedLocation = await getUserLocation();
    
    setIsTyping(false);
    setProcessingStage('complete');
    setLocationLoading(false);
    
    if (detectedLocation) {
      setUserLocation(detectedLocation);
      const locationText = `in ${detectedLocation.fullAddress}`;
      setSelectedLocation(locationText);
      
      if (selectedService) {
        const newInput = `I need a ${selectedService.toLowerCase()} ${locationText}`;
        addMessage('ai', `Perfect! I found you're in ${detectedLocation.area}${detectedLocation.city !== detectedLocation.area ? `, ${detectedLocation.city}` : ''}. Let me search for ${selectedService.toLowerCase()}s in your specific area.`);
        setConversationState('complete');
        setTimeout(() => handleNlpSubmit(newInput), 800);
      } else {
        addMessage('ai', `Great! I found you're in ${detectedLocation.area}${detectedLocation.city !== detectedLocation.area ? `, ${detectedLocation.city}` : ''}. What service do you need?`);
        setConversationState('awaiting_service');
        setShowQuickReplies(true);
      }
    } else {
      addMessage('ai', 'I couldn\'t detect your exact location. Please tell me your city or neighborhood, or choose from the options above.');
      setShowQuickReplies(true);
    }
  };

  const handleServiceSelect = async (service: typeof serviceOptions[0]) => {
    setShowQuickReplies(false); // Hide quick replies when user interacts
    setSelectedService(service.name);
    
    // If user location is available, auto-submit
    if (userLocation) {
      // Construct more explicit location for international addresses
      const locationParts = [];
      if (userLocation.area) locationParts.push(userLocation.area);
      if (userLocation.city && userLocation.city !== userLocation.area) locationParts.push(userLocation.city);
      if (userLocation.state) locationParts.push(userLocation.state);
      if (userLocation.country && userLocation.country !== 'unknown') locationParts.push(userLocation.country);
      
      const explicitLocation = locationParts.join(', ');
      const locationText = `in ${explicitLocation}`;
      
      // For international locations, make it extra clear
      let queryPrefix = `I need a ${service.name.toLowerCase()} ${locationText}`;
      if (userLocation.country && userLocation.country !== 'unknown' && userLocation.country.toLowerCase() !== 'united states' && userLocation.country.toLowerCase() !== 'usa') {
        queryPrefix = `I need a local ${service.name.toLowerCase()} ${locationText}. Please find service providers specifically in ${userLocation.country}`;
      }
      
      const newInput = queryPrefix;
      setNlpInput(newInput);
      setConversationState('complete');
      setTimeout(() => handleNlpSubmit(newInput), 100);
      return;
    }
    
    // If location was previously selected, use it
    if (selectedLocation) {
      const newInput = `I need a ${service.name.toLowerCase()} ${selectedLocation}`;
      setNlpInput(newInput);
      setConversationState('complete');
      setTimeout(() => handleNlpSubmit(newInput), 100);
      return;
    }
    
    // Otherwise, ask for location
    addMessage('user', `I need a ${service.name.toLowerCase()}`);
    addMessage('ai', `Perfect! I can help you find a ${service.name.toLowerCase()}. Let me know your location - you can say "near me" for your current location or specify a city like "in Chicago".`);
    setConversationState('awaiting_location');
    setShowQuickReplies(false);
  };

  const handleLocationSelect = async (location: {id: string, name: string, icon?: any}) => {
    setShowQuickReplies(false); // Hide quick replies when user interacts
    
    if (location.id === 'near-me') {
      setLocationLoading(true);
      
      // Reset permission state if retrying after denial
      if (locationPermissionState === 'denied' || locationPermissionState === 'unavailable') {
        setLocationPermissionState('asking');
        addMessage('user', 'Try location access');
        addMessage('ai', 'Requesting location access again...');
      } else {
        addMessage('user', 'Near me');
        addMessage('ai', 'Let me get your location...');
      }
      
      const detectedLocation = await getUserLocation();
      
      if (detectedLocation) {
        setUserLocation(detectedLocation);
        
        // Construct more explicit location for international addresses
        const locationParts = [];
        if (detectedLocation.area) locationParts.push(detectedLocation.area);
        if (detectedLocation.city && detectedLocation.city !== detectedLocation.area) locationParts.push(detectedLocation.city);
        if (detectedLocation.state) locationParts.push(detectedLocation.state);
        if (detectedLocation.country && detectedLocation.country !== 'unknown') locationParts.push(detectedLocation.country);
        
        const explicitLocation = locationParts.join(', ');
        const locationText = `in ${explicitLocation}`;
        setSelectedLocation(locationText);
        
        // Update the AI message with the detected location
        setTimeout(() => {
          if (selectedService) {
            // For international locations, make it extra clear
            let queryPrefix = `I need a ${selectedService.toLowerCase()} ${locationText}`;
            if (detectedLocation.country && detectedLocation.country !== 'unknown' && detectedLocation.country.toLowerCase() !== 'united states' && detectedLocation.country.toLowerCase() !== 'usa') {
              queryPrefix = `I need a local ${selectedService.toLowerCase()} ${locationText}. Please find service providers specifically in ${detectedLocation.country}`;
            }
            
            const newInput = queryPrefix;
            addMessage('ai', `Perfect! I found you're in ${detectedLocation.area}${detectedLocation.city !== detectedLocation.area ? `, ${detectedLocation.city}` : ''}. Let me search for ${selectedService.toLowerCase()}s in your area.`);
            setConversationState('complete');
            setTimeout(() => handleNlpSubmit(newInput), 500);
          } else {
            addMessage('ai', `Great! I found you're in ${detectedLocation.area}${detectedLocation.city !== detectedLocation.area ? `, ${detectedLocation.city}` : ''}. What service do you need?`);
            setConversationState('awaiting_service');
            setShowQuickReplies(true);
          }
        }, 800);
      } else {
        setTimeout(() => {
          if (locationPermissionState === 'denied') {
            addMessage('ai', 'Location access was denied. You can click "Near Me" again to try location access, or choose a city manually from the options below.');
          } else {
            addMessage('ai', 'I couldn\'t detect your location. Please try "Near Me" again or choose a city manually from the options below.');
          }
          setShowQuickReplies(true);
        }, 1000);
      }
      setLocationLoading(false);
      return;
    }
    
    // Handle regular location selection
    const locationText = `in ${location.name}`;
    setSelectedLocation(locationText);
    
    if (selectedService) {
      const newInput = `I need a ${selectedService.toLowerCase()} ${locationText}`;
      addMessage('user', locationText);
      addMessage('ai', `Perfect! Let me find ${selectedService.toLowerCase()}s in ${location.name}.`);
      setConversationState('complete');
      setTimeout(() => handleNlpSubmit(newInput), 500);
    } else {
      addMessage('user', locationText);
      addMessage('ai', `Got it! You're looking for services in ${location.name}. What type of service do you need?`);
      setConversationState('awaiting_service');
      setShowQuickReplies(true);
    }
  };

  const handleNewSearch = () => {
    setNlpInput('');
    setSelectedService('');
    setSelectedLocation('');
    setUserLocation(null);
    setConversationState('initial');
    setShowQuickReplies(true);
    addMessage('ai', 'How can I help you find a service provider today?');
    inputRef.current?.focus();
  };

  // Extract structured data for /api/chat endpoint
  const extractStructuredData = (query: string) => {
    console.log('🔍 Extracting from query:', query);
    
    // Extract service - be more flexible and dynamic
    let service = '';
    
    // Modern service extraction with intelligent cleaning
    const servicePatterns = [
      // Pattern 1: Full query with location
      { 
        regex: /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([^in]+?)\s+(?:in|near|close to|at|around)\s+(.+?)(?:\.|$|please|specifically)/i,
        serviceGroup: 1,
        locationGroup: 2,
        desc: 'full query with location'
      },
      // Pattern 2: Service with location pattern but no location words
      {
        regex: /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([^.]+?)(?:\s+(?:in|near|close to|at|around)|$)/i,
        serviceGroup: 1,
        locationGroup: null,
        desc: 'service with potential location'
      }
    ];
    
    let patternMatched = false;
    for (const pattern of servicePatterns) {
      const match = query.match(pattern.regex);
      if (match && match[pattern.serviceGroup]) {
        service = match[pattern.serviceGroup].trim();
        
        // Intelligent service cleaning - remove common noise words
        service = service.replace(/\b(local|some|good|best|reliable|professional)\b/gi, '').trim();
        
        console.log(`✅ Extracted service via ${pattern.desc}:`, service);
        patternMatched = true;
        break;
      }
    }
    
    // Smart location extraction with multiple modern patterns
    let location = '';
    
    // First check if we already extracted location from service pattern
    const serviceWithLocationPattern = servicePatterns[0]; // Full query with location
    const serviceLocationMatch = query.match(serviceWithLocationPattern.regex);
    if (serviceLocationMatch && serviceLocationMatch[2]) {
      location = serviceLocationMatch[2].trim();
      console.log('✅ Extracted location via service pattern:', location);
    } else {
      // Modern location patterns - prioritized by specificity
      const locationPatterns = [
        // Pattern 1: "near [specific location]"
        { regex: /near\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'near location' },
        // Pattern 2: "close to [location]"
        { regex: /close\s+to\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'close to location' },
        // Pattern 3: "around [location]"
        { regex: /around\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'around location' },
        // Pattern 4: "at [location]"
        { regex: /at\s+([^.]+?)(?:\s*$|\.|\,|please)/i, desc: 'at location' },
        // Pattern 5: "in [location]"
        { regex: /in\s+([^.]+?)(?:\s*$|\.|\,|please|specifically)/i, desc: 'in location' },
        // Pattern 6: "near me" or similar self-referential
        { regex: /(near me|close to me|around me|my area|here)/i, desc: 'near me' }
      ];
      
      for (const pattern of locationPatterns) {
        const match = query.match(pattern.regex);
        if (match && match[1]) {
          location = match[1].trim();
          console.log(`✅ Extracted location via ${pattern.desc}:`, location);
          break;
        } else if (pattern.desc === 'near me' && match) {
          location = 'near me';
          console.log(`✅ Extracted location: ${match[0]}`);
          break;
        }
      }
    }
    
    // Post-process location to handle context-specific terms
    if (location === 'my area' || location === 'near me') {
      // Replace with actual user location if available
      console.log('🔍 Processing "near me" - userLocation:', userLocation);
      if (userLocation) {
        const locationParts = [];
        if (userLocation.area) locationParts.push(userLocation.area);
        if (userLocation.city && userLocation.city !== userLocation.area) locationParts.push(userLocation.city);
        if (userLocation.state) locationParts.push(userLocation.state);
        if (userLocation.country && userLocation.country !== 'unknown') locationParts.push(userLocation.country);
        location = locationParts.join(', ');
        console.log('✅ Replaced "near me" with actual location:', location);
      } else {
        console.log('⚠️ "near me" detected but no userLocation available');
      }
    }
    
    // Additional fallback: If no location found but userLocation exists, use it
    if (!location && userLocation && (query.includes('near me') || query.includes('close to me') || query.includes('my area'))) {
      const locationParts = [];
      if (userLocation.area) locationParts.push(userLocation.area);
      if (userLocation.city && userLocation.city !== userLocation.area) locationParts.push(userLocation.city);
      if (userLocation.state) locationParts.push(userLocation.state);
      if (userLocation.country && userLocation.country !== 'unknown') locationParts.push(userLocation.country);
      location = locationParts.join(', ');
      console.log('🔄 Fallback: Used userLocation as location context:', location);
    }
    
    console.log('🎯 Final extraction:', { service, location });
    return { service, location };
  };

  // Check if previous message was asking for location and current is just location
  const isLocationResponse = (query: string, messages: Message[]) => {
    if (messages.length === 0) return false;
    const lastAiMessage = messages.filter(m => m.type === 'ai').pop();
    if (!lastAiMessage) return false;
    
    const isLocationPrompt = lastAiMessage.content.toLowerCase().includes('need to know your location') || 
                            lastAiMessage.content.toLowerCase().includes('where you\'re located') ||
                            lastAiMessage.content.toLowerCase().includes('tell me where') ||
                            lastAiMessage.content.toLowerCase().includes('where are you located') ||
                            lastAiMessage.content.toLowerCase().includes('let me know your location') ||
                            conversationState === 'awaiting_location';
    
    const isJustLocation = /^(in|near|at)\s+[a-zA-Z\s,]+$/i.test(query.trim()) || 
                          /^[a-zA-Z\s,]+$/i.test(query.trim()) && query.trim().split(' ').length <= 4 ||
                          query.toLowerCase().trim() === 'near me';
    
    return isLocationPrompt && isJustLocation;
  };

  // Extract service from conversation history
  const getServiceFromHistory = (messages: Message[]) => {
    // Look for the most recent user message that mentioned a service
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.type === 'user') {
        const serviceKeywords = ['electrician', 'plumber', 'mechanic', 'cleaner', 'handyman', 'carpenter', 'painter', 'locksmith'];
        const foundService = serviceKeywords.find(service => message.content.toLowerCase().includes(service));
        if (foundService) {
          return foundService;
        }
        // Also check for "need a/an" patterns
        const serviceMatch = message.content.toLowerCase().match(/(?:need|want|looking for|find)\s+(?:a|an)\s+([a-zA-Z]+)/);
        if (serviceMatch && serviceMatch[1]) {
          return serviceMatch[1];
        }
      }
    }
    return null;
  };

  // Validate if query is service-related and has both service and location
  const validateQuery = (query: string, messages: Message[]) => {
    const lowerQuery = query.toLowerCase();
    
    // Check if this is a location response to a previous service request
    if (isLocationResponse(query, messages)) {
      const service = getServiceFromHistory(messages);
      if (service) {
        return { 
          hasService: true, 
          hasLocation: true, 
          isServiceRelated: true, 
          isLocationResponse: true,
          combinedQuery: query.toLowerCase().trim() === 'near me' 
            ? `I need a ${service} near me` 
            : `I need a ${service} ${query.startsWith('in') || query.startsWith('near') ? query : 'in ' + query}`
        };
      }
    }
    
    // Dynamic service recognition - trust user intent
    // Look for service-related patterns or assume intent if user is in service context
    const hasServicePattern = lowerQuery.includes('need') || lowerQuery.includes('find') || 
                             lowerQuery.includes('looking for') || lowerQuery.includes('want') ||
                             lowerQuery.includes('i need') || lowerQuery.includes('get me') ||
                             lowerQuery.includes('hire') || lowerQuery.includes('book');
    
    // If we're in awaiting_service state, assume any non-greeting/non-question is a service
    const isInServiceContext = conversationState === 'awaiting_service';
    const isGreetingOrQuestion = lowerQuery.includes('hello') || lowerQuery.includes('hi') || 
                                lowerQuery.includes('how are you') || lowerQuery.includes('what') || 
                                lowerQuery.includes('why') || lowerQuery.includes('when') ||
                                lowerQuery.includes('where') || lowerQuery.includes('who');
    
    // If it's a single word/short phrase and we're expecting a service, assume it's a service
    const isLikelyService = isInServiceContext && !isGreetingOrQuestion && query.trim().split(' ').length <= 3;
    
    const hasService = hasServicePattern || isLikelyService;
    
    // Check for location keywords
    const locationKeywords = [
      'near me', 'nearby', 'in ', 'at ', 'around', 'close to', 'within',
      'chicago', 'new york', 'los angeles', 'houston', 'phoenix', 'philadelphia',
      'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
      'lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'multan'
    ];
    
    const hasLocation = locationKeywords.some(keyword => lowerQuery.includes(keyword)) ||
                       conversationState === 'awaiting_service'; // If we're awaiting service, location is implied
    
    return { 
      hasService, 
      hasLocation, 
      isServiceRelated: hasService, 
      isLocationResponse: false,
      combinedQuery: query
    };
  };

  const handleNlpSubmit = async (customQuery?: string) => {
    const query = customQuery || nlpInput.trim();
    if (!query || isLoading) return;

    // Handle "near me" specifically
    if (query.toLowerCase().trim() === 'near me' && conversationState === 'awaiting_location') {
      await handleNearMeResponse();
      return;
    }

    // Validate the query
    const validation = validateQuery(query, messages);

    // Use combined query if this is a location response
    const queryToProcess = validation.combinedQuery;
    
    // Handle non-service related queries
    if (!validation.isServiceRelated) {
      setNlpInput('');
      addMessage('user', query);
      
      // More natural responses based on query type
      if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
        addMessage('ai', "Hello! I'm here to help you find local service providers. What kind of service do you need? For example, you could say 'I need a plumber' or 'find an electrician near me'.");
      } else if (query.toLowerCase().includes('how are you')) {
        addMessage('ai', "I'm doing great, thanks for asking! I'm ready to help you find local services. What do you need help with today?");
      } else {
        addMessage('ai', "I specialize in connecting you with local service providers. Try asking something like 'I need an electrician in [your city]' or 'find a plumber near me'. What service are you looking for?");
      }
  // keep quick replies hidden — user already engaged
  setShowQuickReplies(false);
      return;
    }
    
    // Handle incomplete queries (service without location) - but not if it's a location response
    if (validation.hasService && !validation.hasLocation && !validation.isLocationResponse) {
      setNlpInput('');
      addMessage('user', query);
      
      // Extract service name - handle both full queries and simple service names
      let service = query.trim();
      
      // Smart service extraction for context-aware scenarios
      const cleanQuery = query.trim().toLowerCase();
      
      // Check if it's a simple service name (single word or simple phrase)
      const isSimpleService = /^[a-zA-Z\s]{1,50}$/.test(service) && 
                             !cleanQuery.includes('need') && 
                             !cleanQuery.includes('want') && 
                             !cleanQuery.includes('find') &&
                             !cleanQuery.includes('get') &&
                             !cleanQuery.includes('hire');
      
      if (isSimpleService) {
        // Keep as is for simple services like "dentist", "plumber"
        service = query.trim();
      } else {
        // Use modern extraction for complex queries
        const modernPatterns = [
          /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([^.]+?)(?:\s+(?:in|near|close to|at|around)|$)/i,
          /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*([^.]+?)$/i
        ];
        
        for (const pattern of modernPatterns) {
          const match = query.match(pattern);
          if (match && match[1]) {
            service = match[1].trim();
            // Clean extracted service
            service = service.replace(/\b(local|some|good|best|reliable|professional)\b/gi, '').trim();
            break;
          }
        }
      }
      
      console.log('🔍 Service extracted from user input:', { originalQuery: query, extractedService: service });
      setSelectedService(service);
      
      // If we have user's location from previous interaction, auto-proceed with search
      if (userLocation) {
        // Construct more explicit location for international addresses
        const locationParts = [];
        if (userLocation.area) locationParts.push(userLocation.area);
        if (userLocation.city && userLocation.city !== userLocation.area) locationParts.push(userLocation.city);
        if (userLocation.state) locationParts.push(userLocation.state);
        if (userLocation.country && userLocation.country !== 'unknown') locationParts.push(userLocation.country);
        
        const explicitLocation = locationParts.join(', ');
        const locationText = `in ${explicitLocation}`;
        
        // For international locations, make it extra clear
        let queryPrefix = `I need a ${service} ${locationText}`;
        if (userLocation.country && userLocation.country !== 'unknown' && userLocation.country.toLowerCase() !== 'united states' && userLocation.country.toLowerCase() !== 'usa') {
          queryPrefix = `I need a local ${service} ${locationText}. Please find service providers specifically in ${userLocation.country}`;
        }
        
        console.log('🔍 Auto-searching with service + location:', { service, userLocation, queryPrefix });
        addMessage('ai', `Perfect! Let me find ${service}s in ${userLocation.area}${userLocation.city !== userLocation.area ? `, ${userLocation.city}` : ''}.`);
        setConversationState('complete');
        setTimeout(() => handleNlpSubmit(queryPrefix), 500);
        return;
      } else {
        addMessage('ai', `Perfect! I can help you find a ${service}. Just let me know where you're located - you can say 'near me' or specify a city like 'in Chicago'.`);
        setShowQuickReplies(true);
      }
      setConversationState('awaiting_location');
      return;
    }

  setNlpInput('');
  // hide quick replies once user starts a search; they'll re-appear only after first search completes or on guidance
  setShowQuickReplies(false);
    setSelectedService('');
    // Don't clear selectedLocation or userLocation - preserve location context
    // setSelectedLocation('');
    addMessage('user', query);
    setIsLoading(true);
    setIsTyping(true);
    setShowCardSkeletons(false);

    try {
      // Start live processing stages with natural, slower timing
      setProcessingStage('thinking');
      const t1 = window.setTimeout(() => setProcessingStage('searching'), 1200);
      const t2 = window.setTimeout(() => setProcessingStage('organizing'), 2800);
      const t3 = window.setTimeout(() => setShowCardSkeletons(true), 3200);
      processingTimeoutsRef.current.push(t1, t2, t3);

      // Determine if we should use structured /api/chat or natural language /api/nlp
      let response;
      let data;
      
      // Check if we can extract structured data for /api/chat
      const structuredData = extractStructuredData(queryToProcess);
      console.log('🔍 Query processing:', { queryToProcess, structuredData });
      
      if (structuredData.service && structuredData.location) {
        try {
          // Use /api/chat for structured queries
          console.log('✅ Using /api/chat with structured data:', {
            service: structuredData.service,
            location: structuredData.location,
            count: 3
          });

          const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
          console.log('🌐 Sending request to:', `${baseUrl}/api/chat`);

          response = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              service: structuredData.service,
              location: structuredData.location,
              count: 3
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            console.error('🔴 Server response:', text);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
          }
        } catch (error) {
          console.error('🔴 API request failed:', error);
          // Add user-friendly error message
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'I apologize, but I\'m having trouble connecting to the service right now. Please try again in a moment.'
            }
          ]);
          setIsLoading(false);
          return;
        }
        if (!response.ok) throw new Error('Failed to process query');
        const chatData = await response.json();
        // Transform chat response to match expected format
        data = {
          valid: true,
          providers: chatData.providers,
          usage_report: chatData.usage_report
        };
      } else {
        // Use /api/nlp for natural language queries
        console.log('⚠️ Using /api/nlp with query:', queryToProcess);
        response = await fetch('http://localhost:8000/api/nlp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryToProcess }),
        });
        if (!response.ok) throw new Error('Failed to process query');
        data = await response.json();
      }

      // Ensure UI shows complete and clear any pending timeouts
      setShowCardSkeletons(false);
      setProcessingStage('complete');
      processingTimeoutsRef.current.forEach(id => clearTimeout(id));
      processingTimeoutsRef.current = [];
      setIsTyping(false);
      
      console.log('📊 API Response:', data);
      
      // Handle different response cases
      if (!data.valid) {
        // Case C: Invalid Query
        addMessage('ai', "I can only help with finding local services. Please try asking again with a service and location, like 'find an electrician near me'.");
        setConversationState('initial');
  setShowQuickReplies(true);
  } else if (data.providers && data.providers.length > 0) {
        // Case A: Success with providers
        const location = queryToProcess.match(/in\s+([^,.!?]+)|near\s+([^,.!?]+)|near me/i)?.[0] || 'your area';
        const serviceMatch = queryToProcess.match(/(?:need|find|looking for)\s+(?:a|an)?\s*([^in]+?)(?:\s+in|\s+near|$)/i);
        const service = serviceMatch?.[1]?.trim() || 'service providers';
        
        // More natural success message
        if (validation.isLocationResponse) {
          const businesses: Business[] = data.providers.map(provider => ({
            id: provider.id || Math.random().toString(),
            name: provider.name,
            description: provider.details || '',
            category: service,
            services: [],
            location: {
              address: provider.address,
              city: '',
              state: '',
              zip: ''
            },
            saved: false
          }));

          addMessage('ai', `Perfect! I found ${businesses.length} ${service}${businesses.length === 1 ? '' : 's'} ${location}. Here are your options:`, { businesses });
        } else {
          const businesses: Business[] = data.providers.map(provider => ({
            id: provider.id || Math.random().toString(),
            name: provider.name,
            description: provider.details || '',
            category: service,
            services: [],
            location: {
              address: provider.address,
              city: '',
              state: '',
              zip: ''
            },
            saved: false
          }));

          addMessage('ai', `Great! I found ${businesses.length} ${service}${businesses.length === 1 ? '' : 's'} ${location}. Here are the top matches:`, { businesses });
        }
        
  setConversationState('complete');
      } else {
        // Case B: No results found
        const serviceMatch = queryToProcess.match(/(?:need|find|looking for)\s+(?:a|an)?\s*([^in]+?)(?:\s+in|\s+near|$)/i);
        const locationMatch = queryToProcess.match(/(?:in|near)\s+([^,.!?]+)/i);
        const service = serviceMatch?.[1]?.trim() || 'service';
        const location = locationMatch?.[1]?.trim() || 'your area';
        
        addMessage('ai', `I searched for ${service} in ${location} but couldn't find any specific listings. Would you like to try a broader search or a different service?`);
        setConversationState('initial');
  setShowQuickReplies(true);
      }
    } catch (error) {
      setIsTyping(false);
      setShowCardSkeletons(false);
      setProcessingStage('complete');
      processingTimeoutsRef.current.forEach(id => clearTimeout(id));
      processingTimeoutsRef.current = [];
      addMessage('ai', 'I\'m having trouble connecting to my search system right now. Please check your connection and try again.');
      setConversationState('initial');
      setShowQuickReplies(true);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize location services on mount (non-intrusive)
  useEffect(() => {
    // Only check permissions without requesting location automatically
    const checkPermissions = async () => {
      console.log('Checking location permissions...');
      
      if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        setLocationPermissionState('unavailable');
        setIsInitializing(false);
        return;
      }

      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          // map PermissionState to our local union (treat 'prompt' as 'asking')
          const stateMap: Record<string, 'asking' | 'granted' | 'denied' | 'unavailable'> = {
            'granted': 'granted',
            'denied': 'denied',
            'prompt': 'asking'
          };
          setLocationPermissionState(stateMap[(permission.state as string)] || 'unavailable');
          console.log('Current permission state:', permission.state);
          
          // If permission is already granted, get location silently for better UX
          if (permission.state === 'granted') {
            console.log('Permission granted, getting location for city suggestions...');
            setLocationLoadingState('loading');
            
            try {
              const position = (await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  timeout: 10000,
                  enableHighAccuracy: false,
                  maximumAge: 600000 // 10 minutes cache
                });
              })) as GeolocationPosition;

              // Get detailed location info
              const detectedLocation = await getUserLocationFromCoords(position.coords);
              if (detectedLocation) {
                setUserLocation(detectedLocation);
                console.log('User location set:', detectedLocation);
              }
              
              // Get nearby cities for suggestions with smooth loading
              const cities = await getNearbyCities({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
              
              if (cities.length > 0) {
                // Small delay to show smooth transition
                setTimeout(() => {
                  setNearbyCities(cities);
                  setLocationLoadingState('loaded');
                  console.log('Nearby cities set:', cities);
                }, 300);
              } else {
                setLocationLoadingState('loaded');
              }
            } catch (locationError) {
              console.log('Silent location fetch failed:', locationError);
              setLocationLoadingState('loaded');
              // Don't show error to user, just continue without location
            }
          }
          
          setIsInitializing(false);
  } catch {
          console.log('Permission API not supported');
          setLocationPermissionState('asking');
          setIsInitializing(false);
        }
      } else {
        setLocationPermissionState('asking');
        setIsInitializing(false);
      }
    };
    
    checkPermissions();
  }, []);

  // Add initial message after initialization
  useEffect(() => {
    if (!isInitializing && messages.length === 0 && !isLoading && !initialMessageAdded.current) {
      let welcomeMessage = 'How can I help you find a service provider today?';
      
      if (locationPermissionState === 'granted' && userLocation) {
        welcomeMessage += ` I can see you're in ${userLocation.area}${userLocation.city !== userLocation.area ? `, ${userLocation.city}` : ''}.`;
      } else if (locationPermissionState === 'denied') {
        welcomeMessage += ' You can still search by specifying your location manually.';
      }
      
      addMessage('ai', welcomeMessage);
      setShowQuickReplies(true);
      setConversationState('initial');
      initialMessageAdded.current = true;
    }
  }, [isInitializing, messages.length, isLoading, addMessage, locationPermissionState, userLocation]);

  const LocationSkeleton = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={premiumSpring}
        className="flex flex-wrap justify-center gap-3"
      >
        <motion.div 
          className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-3 backdrop-blur-sm ${isDark ? 'bg-gradient-to-r from-gray-700/60 to-gray-800/40 border border-gray-600/30' : 'bg-gradient-to-r from-gray-100/80 to-gray-200/60 border border-gray-300/30'}`}
          animate={{ 
            scale: [1, 1.02, 1],
            boxShadow: [
              '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Navigation className="w-4 h-4 text-blue-500" />
          </motion.div>
          <motion.span 
            className={isDark ? 'text-gray-200' : 'text-gray-700'}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading nearby areas...
          </motion.span>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4].map((index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                delay: 0.3 + index * 0.1, 
                ...springConfig,
                rotateY: { duration: 0.5 }
              }}
              className={`h-9 rounded-full relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-gray-700/40 to-gray-800/20' : 'bg-gradient-to-r from-gray-200/60 to-gray-100/40'}`}
              style={{ width: `${60 + Math.random() * 40}px` }}
            >
              <motion.div
                className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-transparent via-gray-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-white/50 to-transparent'}`}
                animate={{ x: ['-100%', '100%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: [0.65, 0, 0.35, 1]
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const ProcessingIndicator = () => {
    const stages: Record<typeof processingStage, string> = { 
      thinking: 'Understanding your request...', 
      searching: 'Searching local providers...', 
      organizing: 'Organizing results...',
      complete: 'Complete'
    };
    
    if (processingStage === 'complete') return null;
    
    return (
      <motion.div 
        layout 
        className="flex flex-col space-y-4 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={premiumSpring}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            {[0, 1, 2].map((index) => (
              <motion.div 
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                  y: [0, -4, 0]
                }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity, 
                  delay: index * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                }}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={processingStage}
              initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
              transition={springConfig}
              className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {stages[processingStage]}
            </motion.span>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {(processingStage === 'organizing' || showCardSkeletons) && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ ...premiumSpring, height: { duration: 0.4 } }}
              className="space-y-3 mt-2">
              {[0, 1, 2].map((index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -24, rotateX: 15 }}
                  animate={{ opacity: 1, x: 0, rotateX: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    ...springConfig,
                    rotateX: { duration: 0.4 }
                  }}
                  className={`h-16 rounded-xl relative overflow-hidden ${isDark ? 'bg-gray-700/40' : 'bg-gray-200/60'}`}
                >
                  <motion.div
                    className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-transparent via-gray-600/20 to-transparent' : 'bg-gradient-to-r from-transparent via-white/40 to-transparent'}`}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const isDark = theme === 'dark';
  
  const themeStyles = {
    background: isDark 
      ? "min-h-screen bg-[#0D1117] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
      : "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50",
    header: isDark
      ? "bg-[#161B22]/80 backdrop-blur-2xl border-b border-gray-800/50 shadow-lg"
      : "bg-white/80 backdrop-blur-2xl border-b border-gray-200 shadow-sm",
    headerButton: isDark
      ? "px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-[#E6EDF3] hover:text-white transition-all duration-200 text-sm font-medium hover:shadow-lg hover:scale-105"
      : "px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 text-sm font-medium hover:shadow-md",
    messageArea: isDark
      ? "flex-1 overflow-y-auto scroll-smooth"
      : "flex-1 overflow-y-auto scroll-smooth",
    messageUser: isDark ? "bg-blue-600 text-white shadow-lg" : "bg-blue-500 text-white shadow-lg",
    messageAI: isDark
      ? "bg-[#161B22] text-[#E6EDF3] shadow-xl border border-[#30363D] backdrop-blur-sm"
      : "bg-white text-gray-800 shadow-lg border border-gray-200",
    serviceCard: isDark
      ? "bg-[#161B22]/50 border border-[#30363D] hover:bg-[#21262D] hover:border-[#4A80F0]/30 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      : "bg-white/50 border border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200",
    locationChip: isDark
      ? "bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:bg-[#21262D] hover:text-[#E6EDF3] hover:border-[#4A80F0]/50 transition-all duration-200"
      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200",
    providerCard: isDark
  ? "relative group rounded-2xl p-[1.5px] bg-gradient-to-br from-blue-500/30 via-blue-400/10 to-transparent shadow-[0_4px_18px_-4px_rgba(0,0,0,0.6)] hover:shadow-[0_6px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300"
  : "relative group rounded-2xl p-[1.5px] bg-gradient-to-br from-blue-500/40 via-indigo-300/10 to-transparent shadow-[0_4px_14px_-4px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.25)] transition-all duration-300",
    providerCardInner: isDark
  ? "rounded-2xl bg-[#161B22]/90 backdrop-blur-xl border border-[#30363D] p-4 min-h-[92px] flex flex-col overflow-hidden"
  : "rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200 p-4 min-h-[92px] flex flex-col overflow-hidden",
    inputArea: isDark
      ? "bg-[#161B22]/80 backdrop-blur-2xl border-t border-[#30363D] shadow-2xl"
      : "bg-white/80 backdrop-blur-2xl border-t border-gray-200 shadow-lg",
    inputField: isDark
      ? "bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] placeholder-[#8B949E] focus:border-[#4A80F0] focus:shadow-[0_0_0_4px_rgba(74,128,240,0.1),0_0_0_1px_#4A80F0]"
      : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1),0_0_0_1px_#3B82F6]",
    sendButton: isDark
      ? "bg-gradient-to-r from-[#4A80F0] to-[#6366F1] hover:from-[#5A90FF] hover:to-[#7376F1] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(74,128,240,0.2)]"
      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]",
    timestamp: isDark ? 'text-gray-500' : 'text-gray-400'
  };

  // Modern spring-based animation system
  const springConfig = {
    type: "spring",
    damping: 25,
    stiffness: 300,
    mass: 0.8
  } as const;

  const premiumSpring = {
    type: "spring",
    damping: 30,
    stiffness: 400,
    mass: 0.6
  } as const;

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 24,
      scale: 0.94,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        ...springConfig,
        opacity: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        filter: { duration: 0.3 }
      }
    },
  };

  const providerCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 32,
      scale: 0.9,
      rotateX: 15,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        ...premiumSpring,
        filter: { duration: 0.4 },
        rotateX: { ...premiumSpring, duration: 0.6 }
      }
    },
  };

  const optionsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.15,
        when: "beforeChildren"
      }
    },
  };

  const serviceCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.92,
      rotateY: -15,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        ...premiumSpring,
        filter: { duration: 0.3 }
      }
  }
  };

  const locationChipVariants = {
    hidden: { 
      opacity: 0, 
      x: -16,
      scale: 0.85,
      filter: "blur(2px)"
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        ...springConfig,
        filter: { duration: 0.25 }
      }
    }
  };

  return (
    <div className={`${themeStyles.background} flex flex-col h-screen`}>
        <header className={`sticky top-0 z-20 ${themeStyles.header}`}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className={`${themeStyles.headerButton} flex items-center gap-2`}>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:block">Back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center`}>
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ServiceGPT</h1>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>AI Service Finder</p>
                  </div>
                </div>
              </div>
              <button onClick={handleNewSearch} className={`${themeStyles.headerButton} flex items-center gap-2`}>
                <Search className="w-4 h-4" />
                <span className="hidden sm:block">New</span>
              </button>
            </div>
          </div>
        </header>

        <div className={`${themeStyles.messageArea} px-4 pb-4`}>
          <div className="max-w-2xl mx-auto space-y-6 pt-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={messageVariants}
                  transition={{ duration: 0.4, type: "spring" }}
                  className={`flex items-end gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse ml-auto' : 'mr-auto'}`}>
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : (isDark ? 'bg-gray-700' : 'bg-gray-500')}`}>
                    {message.type === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                  </div>
                  <div className="flex-1 space-y-1 w-full">
                    <motion.div layout="position" className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-base w-fit ${message.type === 'user' ? `${themeStyles.messageUser} rounded-br-none ml-auto` : `${themeStyles.messageAI} rounded-bl-none`}`}>
                      {message.content}
                    </motion.div>
                    {message.businesses ? (
                      <motion.div layout variants={optionsContainerVariants} initial="hidden" animate="visible" className="pt-2">
                        <div className="flex flex-col gap-4">
                          {message.businesses.map((business, index) => (
                            <BusinessCard
                              key={business.id}
                              business={business}
                              onToggleSave={handleToggleSave}
                              expanded={expandedCard === index}
                              onToggleExpand={() => setExpandedCard(prev => prev === index ? null : index)}
                              theme={theme}
                            />
                          ))}
                        </div>
                      </motion.div>
                    ) : message.providers && (
                      <motion.div layout variants={optionsContainerVariants} initial="hidden" animate="visible" className="pt-2">
                        {/* Desktop: now vertical stack (was multi-column grid) */}
                        <div className="hidden md:flex md:flex-col gap-4">
                          {message.providers.slice(0, 3).map((provider, index) => (
                            <motion.div
                              variants={providerCardVariants}
                              key={index}
                              data-provider-index={index}
          className={`${themeStyles.providerCard} w-full`}
                              whileHover={{ 
                                y: -4,
                                transition: { duration: 0.25 }
                              }}
                              layout>
                              <div className={`${themeStyles.providerCardInner} transition-all duration-300 gap-3 h-full`}>                                  
                                {/* Top section */}
                                <div className="flex items-start gap-4 relative">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 ring-1 ring-gray-700/60' : 'bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200'} relative overflow-hidden`}> 
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)]" />
                                    <span className={`font-bold text-lg tracking-wide ${isDark ? 'text-white' : 'text-gray-800'}`}>{provider.name.split(' ')[0].charAt(0)}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h3 className={`font-semibold text-[15px] leading-snug ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>{provider.name}</h3>
                                      <div className="flex items-center gap-1 shrink-0">
                                        {provider.location_note === 'EXACT' && <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow" />}
                                        {provider.confidence === 'HIGH' && <Shield className="w-4 h-4 text-amber-400 drop-shadow" />}
                                      </div>
                                    </div>
                                    <div className={`mt-1.5 text-xs font-medium uppercase tracking-wide ${isDark ? 'text-blue-300/70' : 'text-blue-700/70'}`}>{provider.location_note === 'EXACT' ? 'Exact Match' : provider.confidence === 'HIGH' ? 'High Confidence' : 'Suggested'}</div>
                                    <p className={`mt-1 text-sm leading-snug ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>{provider.address}</p>
                                  </div>
                                </div>

                                {/* Expanded details */}
                                <AnimatePresence>
                                  {expandedCard === index && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3 rounded-lg border border-dashed border-gray-500/30 bg-gradient-to-br from-transparent via-gray-500/10 to-transparent p-3">
                                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{provider.details}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Divider */}
                                <div className="relative mt-3 mb-1">
                                  <div className={`h-px w-full ${isDark ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`} />
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center gap-2 mt-auto">
                                  <a href={`tel:${provider.phone}`} className={`group/btn flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold flex-1 justify-center relative overflow-hidden transition-all ${isDark ? 'bg-gradient-to-r from-blue-600/70 to-indigo-600/70 hover:from-blue-600 hover:to-indigo-600 text-blue-50 shadow-inner shadow-blue-900/40' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md'} `}>
                                    <span className="relative z-10 flex items-center gap-2"><Phone className="w-4 h-4" /> Call</span>
                                    <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_70%)]" />
                                  </a>
                                  <button onClick={() => toggleExpandedCard(index)} className={`group/btn flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold relative overflow-hidden transition-all ${isDark ? 'bg-gray-800/70 text-gray-300 hover:text-white hover:bg-gray-700/80 border border-gray-700' : 'bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'}`}>
                                    <span className="relative z-10 flex items-center gap-1">More <motion.div animate={{ rotate: expandedCard === index ? 180 : 0 }}><ChevronDown className="w-4 h-4" /></motion.div></span>
                                    <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_70%)]" />
                                  </button>
                                  <button onClick={() => navigator.clipboard.writeText(`${provider.name}\n${provider.phone}\n${provider.address}`)} className={`group/btn p-2 rounded-lg transition-all relative overflow-hidden ${isDark ? 'text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700' : 'text-gray-500 hover:text-gray-800 bg-gray-100/60 hover:bg-gray-200 border border-gray-200'}`}>
                                    <Copy className="w-4 h-4 relative z-10" />
                                    <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.35),transparent_70%)]" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Mobile: vertical stack */}
                        <div className="md:hidden space-y-3">
                          {message.providers.slice(0, 3).map((provider, index) => (
                            <motion.div
                              variants={providerCardVariants}
                              key={index}
                              data-provider-index={index}
                              className={`${themeStyles.providerCard} w-full`}
                              whileHover={{ y: -4, transition: { duration: 0.25 } }}
                              layout>
                              <div className={`${themeStyles.providerCardInner} transition-all duration-300 flex flex-col gap-3`}>
                                <div className="flex items-start gap-3">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 ring-1 ring-gray-700/60' : 'bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200'}`}>
                                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{provider.name.split(' ')[0].charAt(0)}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h3 className={`font-semibold text-[15px] leading-snug ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>{provider.name}</h3>
                                      <div className="flex items-center gap-1">
                                        {provider.location_note === 'EXACT' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                        {provider.confidence === 'HIGH' && <Shield className="w-4 h-4 text-amber-400" />}
                                      </div>
                                    </div>
                                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>{provider.address}</p>
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedCard === index && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden rounded-lg bg-gradient-to-br from-transparent via-gray-500/10 to-transparent p-3">
                                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{provider.details}</p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                <div className="flex items-center gap-2 mt-auto">
                                  <a href={`tel:${provider.phone}`} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold flex-1 justify-center transition-all relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-blue-600/70 to-indigo-600/70 hover:from-blue-600 hover:to-indigo-600 text-blue-50' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'}`}>
                                    <Phone className="w-4 h-4" /> Call
                                  </a>
                                  <button onClick={() => toggleExpandedCard(index)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isDark ? 'bg-gray-800/70 text-gray-300 hover:text-white hover:bg-gray-700/80 border border-gray-700' : 'bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'}`}>More <motion.div animate={{ rotate: expandedCard === index ? 180 : 0 }}><ChevronDown className="w-4 h-4" /></motion.div></button>
                                  <button onClick={() => navigator.clipboard.writeText(`${provider.name}\n${provider.phone}\n${provider.address}`)} className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700' : 'text-gray-500 hover:text-gray-800 bg-gray-100/60 hover:bg-gray-200 border border-gray-200'}`}><Copy className="w-4 h-4" /></button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* View All Providers Button */}
                        {message.providers.length > 0 && (
                          <motion.div variants={messageVariants} className="text-center pt-2">
                            {loadingMore ? (
                              <div className={`inline-flex items-center justify-center px-6 py-3 rounded-lg ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                <div className="text-sm">{loadingMoreMessage || 'Loading more providers...'}</div>
                              </div>
                            ) : (
                            <button
                              onClick={async () => {
                                // Get the user's original query from conversation history
                                const userMessages = messages.filter(m => m.type === 'user');
                                const lastUserQuery = userMessages[userMessages.length - 1]?.content || '';
                                
                                console.log('🔍 [VIEW ALL] Debug Info:');
                                console.log('🔍 [VIEW ALL] All user messages:', userMessages.map(m => m.content));
                                console.log('🔍 [VIEW ALL] Last user query:', lastUserQuery);
                                console.log('🔍 [VIEW ALL] Current providers count:', message.providers?.length || 0);
                                
                                // Extract service and location from the query with improved patterns
                                let service = '';
                                let location = '';
                                
                                // Improved service extraction patterns
                                const servicePatterns = [
                                  // Pattern 1: "I need a [service] in [location]"
                                  /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([a-zA-Z\s]+?)\s+(?:in|near|close to|at|around)/i,
                                  // Pattern 2: "I need a [service]" (no location)
                                  /(?:i\s+)?(?:need|want|looking for|find|get me|hire|book)\s+(?:a|an)?\s*(?:local\s+)?([a-zA-Z\s]+?)(?:\s*\.|\s*$)/i
                                ];
                                
                                for (const pattern of servicePatterns) {
                                  const match = lastUserQuery.match(pattern);
                                  if (match && match[1]) {
                                    service = match[1].trim();
                                    // Clean extracted service
                                    service = service.replace(/\b(local|some|good|best|reliable|professional)\b/gi, '').trim();
                                    if (service) break;
                                  }
                                }
                                
                                // Location extraction
                                const locationPatterns = [
                                  /\bin\s+([^.]+?)(?:\.|$|please|specifically)/i,
                                  /near\s+([^.]+?)(?:\.|$|please|specifically)/i,
                                  /close\s+to\s+([^.]+?)(?:\.|$|please|specifically)/i,
                                  /at\s+([^.]+?)(?:\.|$|please|specifically)/i,
                                  /around\s+([^.]+?)(?:\.|$|please|specifically)/i
                                ];
                                
                                for (const pattern of locationPatterns) {
                                  const match = lastUserQuery.match(pattern);
                                  if (match && match[1]) {
                                    location = match[1].trim();
                                    break;
                                  }
                                }
                                
                                console.log('🔍 [VIEW ALL] Initial extraction:', { service, location });
                                
                                // If location response, get service from earlier messages
                                if (!service) {
                                  for (let i = userMessages.length - 2; i >= 0; i--) {
                                    const prevQuery = userMessages[i].content;
                                    // Use same improved patterns for history search
                                    for (const pattern of servicePatterns) {
                                      const match = prevQuery.match(pattern);
                                      if (match && match[1]) {
                                        service = match[1].trim();
                                        service = service.replace(/\b(local|some|good|best|reliable|professional)\b/gi, '').trim();
                                        if (service) {
                                          console.log('🔍 [VIEW ALL] Found service from history:', service);
                                          break;
                                        }
                                      }
                                    }
                                    if (service) break;
                                  }
                                }
                                
                                // If location is still empty, check if last query was just a location
                                if (!location && /^(near|in|at)\s+/i.test(lastUserQuery.trim())) {
                                  location = lastUserQuery.replace(/^(near|in|at)\s+/i, '').trim();
                                  console.log('🔍 [VIEW ALL] Found location from query:', location);
                                }
                                
                                console.log('🔍 [VIEW ALL] Final extraction:', { service, location });
                                
                                if (service && location) {
                                  // Show a dynamic loading box in-place while fetching more
                                  setLoadingMore(true);
                                  setLoadingMoreMessage('Loading more providers...');
                                  console.log('🔍 [VIEW ALL] Starting API call with:', { service, location, count: 10 });
                                  
                                  try {
                                    // small staged messages to make it feel dynamic
                                    const s1 = window.setTimeout(() => setLoadingMoreMessage('Found 5+ providers, fetching more...'), 700);
                                    const s2 = window.setTimeout(() => setLoadingMoreMessage('Loading 10 providers...'), 1400);
                                    processingTimeoutsRef.current.push(s1, s2);

                                    // Call /api/chat with count=10 requesting more providers, passing existing names for proper dedupe
                                    const existingNames = (message.providers || []).map(p => p.name).filter(Boolean);
                                    console.log('🔍 [VIEW ALL] Existing names to exclude:', existingNames);
                                    
                                    const apiPayload = { 
                                      service: service, 
                                      location: location, 
                                      count: 10,
                                      existing: existingNames
                                    };
                                    console.log('🔍 [VIEW ALL] API payload:', apiPayload);
                                    
                                    const response = await fetch('http://localhost:8000/api/chat', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify(apiPayload),
                                    });

                                    console.log('🔍 [VIEW ALL] API response status:', response.status);
                                    
                                    if (response.ok) {
                                      const data = await response.json();
                                      const businesses: Business[] = (data.providers as ServiceProvider[] | undefined)?.map(provider => ({
                                        id: provider.id || Math.random().toString(),
                                        name: provider.name,
                                        description: provider.details || '',
                                        category: service,
                                        services: [],
                                        location: {
                                          address: provider.address,
                                          city: '',
                                          state: '',
                                          zip: ''
                                        },
                                        saved: false
                                      })) || [];

                                      const newCount = businesses.length;
                                      console.log('🔍 [VIEW ALL] API response data:', { 
                                        providersCount: newCount, 
                                        businesses: businesses.map(b => b.name)
                                      });
                                      
                                      setLoadingMoreMessage(`Loaded ${newCount} providers successfully`);
                                      // Update businesses in current chat message so user sees expanded list before navigation
                                      if (newCount && newCount > (message.businesses?.length || 0)) {
                                        console.log('🔍 [VIEW ALL] Updating message businesses from', message.businesses?.length || 0, 'to', newCount);
                                        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, businesses } : m));
                                      }
                                      // small delay to let users read the updated list
                                      await new Promise(res => setTimeout(res, 500));
                                      
                                      console.log('🔍 [VIEW ALL] Navigating to providers page with:', {
                                        providersCount: data.providers?.length || 0,
                                        searchQuery: `${service} in ${location}`,
                                        category: service.charAt(0).toUpperCase() + service.slice(1)
                                      });
                                      
                                      // Navigate to ProviderResultsScreen with all providers
                                      navigate('/providers', {
                                        state: {
                                          providers: data.providers || [],
                                          searchQuery: `${service} in ${location}`,
                                          category: service.charAt(0).toUpperCase() + service.slice(1)
                                        }
                                      });
                                    } else {
                                      console.error('🔍 [VIEW ALL] API response not ok:', response.status, response.statusText);
                                      const errorText = await response.text();
                                      console.error('🔍 [VIEW ALL] API error body:', errorText);
                                      
                                      // Fallback: show existing providers in results screen
                                      console.log('🔍 [VIEW ALL] Falling back to existing providers');
                                      navigate('/providers', {
                                        state: {
                                          providers: message.providers,
                                          searchQuery: `${service} in ${location}`,
                                          category: service.charAt(0).toUpperCase() + service.slice(1)
                                        }
                                      });
                                    }
                                  } catch (error) {
                                    console.error('🔍 [VIEW ALL] Error fetching more providers:', error);
                                    // Fallback: show existing providers
                                    navigate('/providers', {
                                      state: {
                                        providers: message.providers,
                                        searchQuery: `${service} in ${location}`,
                                        category: service.charAt(0).toUpperCase() + service.slice(1)
                                      }
                                    });
                                  } finally {
                                    setLoadingMore(false);
                                    setLoadingMoreMessage('');
                                    processingTimeoutsRef.current.forEach(id => clearTimeout(id));
                                    processingTimeoutsRef.current = [];
                                  }
                                } else {
                                  console.log('🔍 [VIEW ALL] Service or location missing, using fallback');
                                  // Show existing providers if we can't extract service/location
                                  navigate('/providers', {
                                    state: {
                                      providers: message.providers,
                                      searchQuery: message.content || 'Service Providers',
                                      category: 'Service Providers'
                                    }
                                  });
                                }
                              }}
                              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                                isDark 
                                  ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30' 
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                              }`}
                            >
                              View All Providers
                            </button>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                    <p className={`text-xs ${themeStyles.timestamp} ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Dynamic Quick Reply Options */}
            <AnimatePresence>
              {showQuickReplies && !isLoading && messages.filter(m => m.type === 'user').length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 pt-4 sm:pt-6"
                >
                  {/* Initial state or awaiting service */}
                  {(conversationState === 'initial' || conversationState === 'awaiting_service') && (
                    <motion.div variants={optionsContainerVariants} initial="hidden" animate="visible" className="space-y-5">
                      <h3 className={`text-base font-semibold text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {conversationState === 'awaiting_service' ? 'What service do you need?' : 'Select a popular service'}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {serviceOptions.map((service) => (
                          <motion.button 
                            variants={serviceCardVariants} 
                            key={service.id} 
                            onClick={() => handleServiceSelect(service)} 
                            className={`flex flex-col items-center justify-center text-center p-5 rounded-2xl backdrop-blur-sm border ${themeStyles.serviceCard} group relative overflow-hidden`}
                            whileHover={{ 
                              scale: 1.03, 
                              y: -4,
                              rotateY: 2,
                              transition: { ...premiumSpring, duration: 0.3 }
                            }}
                            whileTap="tap"
                            style={{
                              perspective: '1000px',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            {/* Subtle gradient overlay */}
                            <motion.div 
                              className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10' : 'bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5'}`}
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            
                            <motion.div 
                              className={`w-14 h-14 rounded-2xl mb-4 ${isDark ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'} flex items-center justify-center shadow-lg relative`}
                              whileHover={{ 
                                scale: 1.15, 
                                rotateY: 10,
                                rotateX: 5,
                                transition: { ...premiumSpring, duration: 0.4 }
                              }}
                              style={{
                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                              }}
                            >
                              <service.icon className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'} relative z-10`} />
                              <motion.div
                                className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20' : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'}`}
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            </motion.div>
                            
                            <motion.h4 
                              className={`font-semibold text-sm ${isDark ? 'text-[#E6EDF3]' : 'text-gray-900'} tracking-wide`}
                              whileHover={{ y: -1 }}
                              transition={springConfig}
                            >
                              {service.name}
                            </motion.h4>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Location selection */}
                  {(conversationState === 'initial' || conversationState === 'awaiting_location') && (
                    <motion.div variants={messageVariants} className="space-y-4">
                      <h3 className={`text-base font-semibold text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {conversationState === 'awaiting_location' ? 'Where are you located?' : 'Or choose a location'}
                      </h3>
                      
                      <AnimatePresence mode="wait">
                        {locationLoadingState === 'loading' ? (
                          <LocationSkeleton />
                        ) : (
                          <motion.div 
                            key="location-options"
                            className="flex flex-wrap justify-center gap-2"
                            variants={optionsContainerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {getLocationOptions().map((loc) => {
                          type LocOpt = { id: string; name: string; icon?: React.ElementType };
                          const location: LocOpt = loc as LocOpt;
                          return (
                            <motion.button
                              variants={locationChipVariants}
                              key={location.id}
                              onClick={() => handleLocationSelect(location)}
                              className={`px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2.5 backdrop-blur-sm border relative overflow-hidden ${
                                location.id === 'near-me' && locationLoading
                                  ? `${themeStyles.locationChip} opacity-50 cursor-not-allowed`
                                  : themeStyles.locationChip
                              }`}
                              disabled={location.id === 'near-me' && locationLoading}
                              whileHover="hover"
                              whileTap={{ 
                                scale: 0.96,
                                transition: { ...premiumSpring, duration: 0.15 }
                              }}
                              style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                              }}
                            >
                              {location.id === 'near-me' && locationLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                location && location.icon ? React.createElement(location.icon as React.ElementType, { className: 'w-4 h-4' }) : null
                              )}
                              {location.name}
                            </motion.button>
                          );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Show user's detected location if available */}
                      {userLocation && conversationState === 'awaiting_location' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center"
                        >
                          <button
                            onClick={() => {
                              const locationText = `in ${userLocation.fullAddress}`;
                              if (selectedService) {
                                const newInput = `I need a ${selectedService.toLowerCase()} ${locationText}`;
                                addMessage('user', `Use my location (${userLocation.area}${userLocation.city !== userLocation.area ? `, ${userLocation.city}` : ''})`);
                                setConversationState('complete');
                                setTimeout(() => handleNlpSubmit(newInput), 100);
                              } else {
                                handleLocationSelect({ id: 'detected', name: `Use ${userLocation.area}` });
                              }
                            }}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-dashed ${
                              isDark 
                                ? 'border-blue-500/50 bg-blue-900/20 text-blue-300 hover:bg-blue-900/30 hover:border-blue-500/70'
                                : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400'
                            }`}
                          >
                            Use my location ({userLocation.area}, {userLocation.city})
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-end gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-500'}`}>
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <motion.div layout className={`px-4 py-3 rounded-2xl rounded-bl-none ${themeStyles.messageAI} min-w-0`}>
                    <ProcessingIndicator />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className={`${themeStyles.inputArea} p-4`}>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleNlpSubmit(); }} className="flex gap-3 items-start">
              <motion.div 
                className="flex-1 relative"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...premiumSpring, delay: 0.1 }}
              >
                <motion.div
                  className="relative"
                  whileFocus={{ scale: 1.01 }}
                  transition={springConfig}
                >
                  <textarea 
                    ref={inputRef} 
                    placeholder="I need a 24/7 plumber for an emergency..." 
                    value={nlpInput} 
                    onChange={(e) => setNlpInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleNlpSubmit())} 
                    className={`w-full px-5 py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base outline-none resize-none pr-14 backdrop-blur-sm border-2 ${themeStyles.inputField}`} 
                    disabled={isLoading} 
                    rows={1} 
                    style={{ 
                      minHeight: '54px', 
                      maxHeight: '120px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      background: isDark 
                        ? 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(22, 27, 34, 0.8) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)'
                    }} 
                    onInput={(e) => { 
                      const target = e.target as HTMLTextAreaElement; 
                      target.style.height = 'auto'; 
                      target.style.height = `${target.scrollHeight}px`; 
                    }}
                    onFocus={() => {
                      // Add subtle focus glow
                      if (inputRef.current) {
                        inputRef.current.style.boxShadow = isDark 
                          ? '0 0 0 2px rgba(74, 128, 240, 0.3), 0 8px 32px rgba(0, 0, 0, 0.12)'
                          : '0 0 0 2px rgba(59, 130, 246, 0.2), 0 8px 32px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                    onBlur={() => {
                      if (inputRef.current) {
                        inputRef.current.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                  />
                  
                  {/* Floating label effect */}
                  <AnimatePresence>
                    {!nlpInput && !isLoading && (
                      <motion.div
                        className={`absolute right-16 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'} text-xs font-medium`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        Press ⏎ to send
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                <motion.button 
                  type="submit" 
                  disabled={!nlpInput.trim() || isLoading} 
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? 'text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70' : 'text-gray-500 hover:text-blue-600 bg-gray-100/50 hover:bg-gray-200/70'} backdrop-blur-sm border`}
                  whileHover={{ 
                    scale: 1.08,
                    rotate: 5,
                    transition: { ...premiumSpring, duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.92,
                    transition: { ...premiumSpring, duration: 0.1 }
                  }}
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SimpleChatInterface;
