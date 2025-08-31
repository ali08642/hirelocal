import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  isTransitioning, 
  onTransitionComplete, 
  children 
}) => {
  const [stage, setStage] = useState<'idle' | 'zooming' | 'sliding' | 'complete'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      setStage('zooming');
      
      // Stage 1: Quick zoom
      setTimeout(() => {
        setStage('sliding');
      }, 250);
      
      // Stage 2: Fast slide transition
      setTimeout(() => {
        setStage('complete');
        onTransitionComplete();
      }, 600);
    }
  }, [isTransitioning, onTransitionComplete]);

  useEffect(() => {
    // Add custom 3D transition styles
    const style = document.createElement('style');
    style.textContent = `
      /* Smooth Fast Transition Effects */
      @keyframes smoothZoom {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(0.95);
          opacity: 0.8;
        }
      }
      
      @keyframes smoothSlideOut {
        0% {
          transform: translateX(0%) scale(0.95);
          opacity: 0.8;
        }
        100% {
          transform: translateX(-100%) scale(0.9);
          opacity: 0;
        }
      }
      
      @keyframes smoothSlideIn {
        0% {
          transform: translateX(100%) scale(0.9);
          opacity: 0;
        }
        100% {
          transform: translateX(0%) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes luxuryParticleFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translateY(-20px) rotate(90deg) scale(1.2);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-30px) rotate(180deg) scale(1.5);
          opacity: 0.8;
        }
        75% {
          transform: translateY(-20px) rotate(270deg) scale(1.2);
          opacity: 0.6;
        }
      }
      
      @keyframes luxuryGradientShift {
        0% {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8));
        }
        25% {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15), rgba(0, 0, 0, 0.7));
        }
        50% {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.6));
        }
        75% {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.2), rgba(0, 0, 0, 0.7));
        }
        100% {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8));
        }
      }
      
      @keyframes particleFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.2;
        }
        50% {
          transform: translateY(-15px) rotate(180deg);
          opacity: 0.5;
        }
      }
      
      .transition-smooth-zoom {
        animation: smoothZoom 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .transition-smooth-slide-out {
        animation: smoothSlideOut 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .transition-smooth-slide-in {
        animation: smoothSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .luxury-particle {
        animation: luxuryParticleFloat 6s ease-in-out infinite;
      }
      
      .luxury-gradient-bg {
        animation: luxuryGradientShift 8s ease-in-out infinite;
      }
      
      .particle-effect {
        animation: particleFloat 5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Simple overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ease-out ${
          stage === 'complete' ? 'opacity-0' : 'opacity-20'
        } bg-black`}
      />
      
      {/* Current Page with Luxury Effects */}
      <div 
        className={`absolute inset-0 ${
          stage === 'zooming' ? 'transition-smooth-zoom' : 
          stage === 'sliding' ? 'transition-smooth-slide-out' : 
          ''
        }`}
      >
        {children}
      </div>
      
      {/* New Page Preview with Smooth Theme */}
      {stage === 'sliding' && (
        <div className="absolute inset-0 transition-smooth-slide-in">
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            {/* Simple loading preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading chat...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTransition;
