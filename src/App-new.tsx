import React, { useState } from 'react';
import {
  LandingScreen,
  AuthScreen,
  Dashboard,
  ChatInterface,
  ProviderResults,
  ProviderDetail,
  ChatHistory,
  AdminDashboard
} from './components';
import { AnimatedBackground } from './components/shared';
import { Provider, ChatMessage, ChatSession, ChatHistoryItem } from './types';
import { mockProviders, mockChatSessions, mockChatHistory } from './data/mockData';

type Screen = 'landing' | 'auth' | 'dashboard' | 'chat' | 'results' | 'provider-detail' | 'history' | 'admin';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(mockChatSessions);

  const handleGetStarted = () => {
    setCurrentScreen('auth');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleStartChat = () => {
    setCurrentScreen('chat');
  };

  const handleSearchServices = (query: string) => {
    setSearchQuery(query);
    setCurrentScreen('results');
  };

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentScreen('provider-detail');
  };

  const handleBackFromProvider = () => {
    setSelectedProvider(null);
    setCurrentScreen('results');
  };

  const handleShowHistory = () => {
    setCurrentScreen('history');
  };

  const handleBackFromHistory = () => {
    setCurrentScreen('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleShowAdmin = () => {
    setCurrentScreen('admin');
  };

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand you need help. Let me find the best service providers for you.',
        timestamp: new Date(),
        suggestions: ['Find electrician', 'Find plumber', 'Emergency service']
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen onGetStarted={handleGetStarted} />;
      
      case 'auth':
        return <AuthScreen onLogin={handleLogin} onBack={handleGetStarted} />;
      
      case 'dashboard':
        return (
          <Dashboard
            onStartChat={handleStartChat}
            onSearchServices={handleSearchServices}
            onShowHistory={handleShowHistory}
            onShowAdmin={handleShowAdmin}
          />
        );
      
      case 'chat':
        return (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={handleBackToDashboard}
          />
        );
      
      case 'results':
        return (
          <ProviderResults
            providers={mockProviders}
            searchQuery={searchQuery}
            onSelectProvider={handleSelectProvider}
            onBack={handleBackToDashboard}
          />
        );
      
      case 'provider-detail':
        return selectedProvider ? (
          <ProviderDetail
            provider={selectedProvider}
            onBack={handleBackFromProvider}
          />
        ) : null;
      
      case 'history':
        return (
          <ChatHistory
            chatHistory={mockChatHistory}
            onBack={handleBackFromHistory}
          />
        );
      
      case 'admin':
        return <AdminDashboard onBack={handleBackToDashboard} />;
      
      default:
        return <LandingScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
