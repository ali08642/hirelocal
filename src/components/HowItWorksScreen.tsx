import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  Search, 
  Users, 
  CheckCircle,
  Star,
  Clock,
  Shield,
  Sparkles,
  ArrowLeft,
  PlayCircle,
  Zap
} from 'lucide-react';
import Navbar from './shared/Navbar';
import { useTheme } from '../theme/useTheme';

const HowItWorksScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Tell Us What You Need",
      description: "Simply describe your service requirements in natural language. Our AI understands context and details.",
      icon: MessageCircle,
      color: theme === 'dark' 
        ? "from-blue-500 to-cyan-500" 
        : "from-blue-400/70 via-slate-300/60 to-cyan-400/70",
      details: [
        "Type or speak your service need",
        "AI asks clarifying questions",
        "Specify location, budget, timeline",
        "Add any special requirements"
      ],
      visual: "💬"
    },
    {
      id: 2,
      title: "AI Finds Perfect Matches",
      description: "Our intelligent system analyzes your requirements and searches through thousands of verified providers.",
      icon: Search,
      color: theme === 'dark' 
        ? "from-purple-500 to-pink-500" 
        : "from-purple-400/70 via-slate-300/60 to-pink-400/70",
      details: [
        "AI processes your requirements",
        "Searches verified provider database",
        "Matches based on expertise & availability",
        "Ranks by relevance and ratings"
      ],
      visual: "🔍"
    },
    {
      id: 3,
      title: "Review Curated Results",
      description: "Get a personalized list of the best service providers tailored to your specific needs and location.",
      icon: Users,
      color: theme === 'dark' 
        ? "from-emerald-500 to-teal-500" 
        : "from-emerald-400/70 via-slate-300/60 to-teal-400/70",
      details: [
        "View provider profiles & ratings",
        "Check real customer reviews",
        "Compare pricing and services",
        "See availability and response times"
      ],
      visual: "📋"
    },
    {
      id: 4,
      title: "Connect Instantly",
      description: "Reach out to your chosen provider through WhatsApp, phone, or email with pre-filled service details.",
      icon: CheckCircle,
      color: theme === 'dark' 
        ? "from-orange-500 to-red-500" 
        : "from-orange-400/70 via-slate-300/60 to-red-400/70",
      details: [
        "One-click WhatsApp messaging",
        "Pre-filled service details",
        "Direct phone calling",
        "Schedule appointments easily"
      ],
      visual: "✅"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All providers are background-checked and verified for quality and reliability."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get matched with qualified providers in seconds, not hours of searching."
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "Real reviews from verified customers help ensure service excellence."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Find emergency services and providers available around the clock."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "Found an amazing electrician in under 2 minutes! The AI understood exactly what I needed and connected me with the perfect professional.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Mike Chen",
      role: "Business Owner",
      content: "ServiceGPT saved me hours of research. The plumber they recommended was professional, reasonably priced, and fixed my issue perfectly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
    },
    {
      name: "Emily Rodriguez",
      role: "Property Manager",
      content: "The AI chat made it so easy to explain my complex requirements. Got connected with exactly the right cleaning service for our office building.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-200'
    }`}>
      {/* Background Effects */}
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]'
          : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]'
      }`}></div>
      
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50'
          : 'bg-gradient-to-br from-white/60 via-slate-100/40 to-gray-200/60'
      }`}></div>
      
      <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20'
          : 'bg-gradient-to-br from-blue-300/30 via-slate-200/40 to-purple-300/30'
      }`}></div>
      
      <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-green-500/20 to-blue-600/20'
          : 'bg-gradient-to-br from-emerald-300/30 via-slate-200/40 to-blue-300/30'
      }`}></div>
      
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-500/10 to-pink-600/10'
          : 'bg-gradient-to-br from-purple-300/20 via-slate-100/30 to-pink-300/20'
      }`}></div>

      {/* Navigation */}
      <Navbar currentPage="how-it-works" />

      {/* Main Content */}
      <div className="relative z-40 max-w-7xl mx-auto px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-16">
        
        {/* Hero Section */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className={`inline-flex items-center space-x-2 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 mb-6 md:mb-8 ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white/70 border border-slate-300/60 shadow-lg'
          }`}>
            <Sparkles className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'}`}>AI-Powered Service Discovery</span>
            <ArrowRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`} />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>How </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ServiceGPT
            </span>
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}> Works</span>
          </h1>

          <p className={`text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
          }`}>
            Discover how our AI-powered platform revolutionizes the way you find and connect with local service professionals. 
            From conversation to connection in just a few simple steps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
            <button 
              onClick={() => navigate('/auth')}
              className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800'
              }`}
            >
              Try It Now →
            </button>
            <button 
              onClick={() => setActiveStep(0)}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 backdrop-blur-sm rounded-xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  : 'bg-white/80 border border-slate-300/60 text-slate-800 hover:bg-white/90 shadow-lg'
              }`}
            >
              <PlayCircle className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Process */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>Simple 4-Step Process</h2>
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'
            }`}>
              Experience the future of service discovery with our intelligent, conversational approach
            </p>
          </div>

          {/* Interactive Step Navigation */}
          <div className="flex justify-center mb-8 md:mb-12 px-4">
            <div className={`flex space-x-2 md:space-x-4 backdrop-blur-sm rounded-2xl p-2 overflow-x-auto ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10'
                : 'bg-white/80 border border-slate-300/60 shadow-xl'
            }`}>
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 whitespace-nowrap text-sm md:text-base font-medium ${
                    activeStep === index
                      ? theme === 'dark'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'bg-gradient-to-r from-slate-200/80 to-slate-300/60 text-slate-800 shadow-lg border border-slate-400/30'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
                  }`}
                >
                  Step {step.id}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Display */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center px-4">
            <div className="order-2 md:order-1">
              <div className="text-4xl md:text-6xl mb-4 md:mb-6 text-center md:text-left">{steps[activeStep].visual}</div>
              <h3 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center md:text-left ${
                theme === 'dark' ? 'text-white' : 'text-slate-800'
              }`}>{steps[activeStep].title}</h3>
              <p className={`text-base md:text-lg mb-6 md:mb-8 leading-relaxed text-center md:text-left ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
              }`}>{steps[activeStep].description}</p>
              
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {steps[activeStep].details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[activeStep].color} flex-shrink-0`}></div>
                    <span className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className={`w-full sm:w-auto px-4 md:px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white/80 text-slate-800 hover:bg-white/90 border border-slate-300/60'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  disabled={activeStep === steps.length - 1}
                  className={`w-full sm:w-auto px-4 md:px-6 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className={`w-full h-48 sm:h-64 md:h-80 bg-gradient-to-br ${steps[activeStep].color} rounded-3xl p-6 md:p-8 flex items-center justify-center transition-all duration-500 ${
                  theme === 'light' ? 'shadow-2xl border border-white/60' : ''
                }`}>
                  <div className="text-center">
                    {React.createElement(steps[activeStep].icon, { 
                      className: `w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-3 md:mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-800'
                      }`
                    })}
                    <div className={`text-xs md:text-sm ${
                      theme === 'dark' ? 'text-white/80' : 'text-slate-700 font-medium'
                    }`}>Step {activeStep + 1} of {steps.length}</div>
                  </div>
                </div>
                {/* Floating elements for visual appeal */}
                <div className={`absolute -top-2 md:-top-4 -right-2 md:-right-4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full animate-pulse ${
                  theme === 'dark' ? 'bg-white/20' : 'bg-slate-400/40'
                }`}></div>
                <div className={`absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 rounded-full animate-pulse ${
                  theme === 'dark' ? 'bg-white/30' : 'bg-slate-400/50'
                }`} style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* All Steps Overview */}
        <div className="mb-16 md:mb-20 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`group relative backdrop-blur-sm rounded-2xl p-4 md:p-6 transition-all duration-300 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-white/70 border border-slate-300/60 hover:bg-white/80 shadow-lg hover:shadow-xl'
                } ${activeStep === index ? (theme === 'dark' ? 'ring-2 ring-blue-500/50' : 'ring-2 ring-blue-400/50') : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform ${
                  theme === 'light' ? 'shadow-lg' : ''
                }`}>
                  {React.createElement(step.icon, { 
                    className: `w-5 h-5 md:w-6 md:h-6 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`
                  })}
                </div>
                <div className={`text-xs md:text-sm mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600 font-semibold'}`}>Step {step.id}</div>
                <h3 className={`text-base md:text-lg font-bold mb-2 md:mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>{step.title}</h3>
                <p className={`text-xs md:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                }`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 md:mb-20 px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>Why Choose ServiceGPT?</h2>
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'
            }`}>
              Built with cutting-edge AI technology to provide the best service discovery experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`backdrop-blur-sm rounded-2xl p-4 md:p-6 transition-all duration-300 group text-center ${
                  theme === 'dark'
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-white/70 border border-slate-300/60 hover:bg-white/80 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-gradient-to-br from-blue-400/80 via-slate-300/70 to-purple-500/80 shadow-lg'
                }`}>
                  {React.createElement(feature.icon, { 
                    className: `w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`
                  })}
                </div>
                <h3 className={`text-base md:text-xl font-bold mb-2 md:mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>{feature.title}</h3>
                <p className={`text-sm md:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 md:mb-20 px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>What Our Users Say</h2>
            <p className={`text-base md:text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'
            }`}>
              Real stories from satisfied customers who found their perfect service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`backdrop-blur-sm rounded-2xl p-4 md:p-6 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                    : 'bg-white/70 border border-slate-300/60 hover:bg-white/80 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4"
                  />
                  <div>
                    <div className={`font-semibold text-sm md:text-base ${
                      theme === 'dark' ? 'text-white' : 'text-slate-800'
                    }`}>{testimonial.name}</div>
                    <div className={`text-xs md:text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-slate-600'
                    }`}>{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex space-x-1 mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`text-sm md:text-base leading-relaxed italic ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
                }`}>"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-4">
          <div className={`backdrop-blur-sm rounded-3xl p-6 md:p-12 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10'
              : 'bg-gradient-to-r from-white/80 via-slate-100/60 to-white/80 border border-slate-300/60 shadow-2xl'
          }`}>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-800'
            }`}>Ready to Get Started?</h2>
            <p className={`text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-700 font-medium'
            }`}>
              Join thousands of satisfied customers who've discovered the easiest way to find local service professionals
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 md:mb-0">
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Finding Providers →
              </button>
              <button 
                onClick={() => navigate('/')}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 backdrop-blur-sm rounded-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    : 'bg-white/80 border border-slate-300/60 text-slate-800 hover:bg-white/90 shadow-lg'
                }`}
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span>Back to Home</span>
              </button>
            </div>

            <div className={`mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs md:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-slate-600 font-medium'
            }`}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksScreen;