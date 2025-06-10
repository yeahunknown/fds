
import React from 'react';

const ChronosLogo = ({ size = 40, className = "" }: { size?: number; className?: string }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-lg chronos-glow"></div>
      
      {/* Main atom structure */}
      <div className="relative w-full h-full">
        {/* Central nucleus */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
        
        {/* Electron orbits */}
        <div className="absolute inset-0 border border-blue-400 rounded-full opacity-60 atom-spin"></div>
        <div 
          className="absolute inset-2 border border-blue-300 rounded-full opacity-40 atom-spin" 
          style={{ animationDirection: 'reverse', animationDuration: '15s' }}
        ></div>
        <div 
          className="absolute inset-1 border border-blue-500 rounded-full opacity-80 atom-spin"
          style={{ animationDuration: '25s' }}
        ></div>
        
        {/* Electrons */}
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2 pulse-slow"></div>
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2 pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-1 h-1 bg-blue-300 rounded-full transform -translate-y-1/2 pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default ChronosLogo;
