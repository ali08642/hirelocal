// Add these imports to SimpleChatInterface.tsx
import { useAuth } from '../../contexts/AuthContextHooks';
import { businessService } from '../firebase/firebase';
import { Heart } from 'lucide-react';

// Add these interfaces
interface SavedStatus {
  [key: string]: boolean;
}

// Add these state variables in the component
const [savedProviders, setSavedProviders] = useState<SavedStatus>({});
const { user } = useAuth();

// Add this effect to load saved status
useEffect(() => {
  const loadSavedProviders = async () => {
    if (!user) return;
    
    try {
      const saved = await businessService.getSavedProviders(user.uid);
      const savedStatus = saved.reduce((acc, provider) => {
        acc[provider.businessInfo.name] = true;
        return acc;
      }, {} as SavedStatus);
      setSavedProviders(savedStatus);
    } catch (error) {
      console.error('Error loading saved providers:', error);
    }
  };

  loadSavedProviders();
}, [user]);

// Add this function to handle save/unsave
const handleSaveProvider = async (provider: ServiceProvider) => {
  if (!user) {
    // Handle not logged in state - maybe show login prompt
    navigate('/auth');
    return;
  }

  try {
    const isSaved = savedProviders[provider.name];
    if (isSaved) {
      // Find the saved provider ID and remove it
      const saved = await businessService.getSavedProviders(user.uid);
      const toRemove = saved.find(p => p.businessInfo.name === provider.name);
      if (toRemove) {
        await businessService.removeSavedProvider(user.uid, toRemove.id);
      }
    } else {
      // Save the provider
      await businessService.saveProvider(user.uid, {
        name: provider.name,
        phone: provider.phone,
        address: provider.address,
        details: provider.details,
        confidence: provider.confidence || 'MEDIUM',
        category: selectedService // Current service category
      });
    }

    // Update local state
    setSavedProviders(prev => ({
      ...prev,
      [provider.name]: !isSaved
    }));
  } catch (error) {
    console.error('Error saving provider:', error);
    // Handle error - maybe show toast
  }
};

// Modify the provider card rendering to include save button
const renderProviderCard = (provider: ServiceProvider, index: number) => {
  const isSaved = savedProviders[provider.name] || false;
  
  return (
    <div className="provider-card">
      {/* Existing provider card content */}
      <button
        onClick={() => handleSaveProvider(provider)}
        className={`save-button ${isSaved ? 'saved' : ''}`}
      >
        <Heart
          className={`w-6 h-6 ${
            isSaved 
              ? 'fill-current text-red-500' 
              : 'text-gray-400 hover:text-red-500'
          }`}
        />
      </button>
    </div>
  );
};
