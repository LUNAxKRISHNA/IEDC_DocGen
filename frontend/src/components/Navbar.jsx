import React from 'react';
import Logo from './Logo';

export default function Navbar({ leftContent, rightContent, centerContent, isHome = false }) {
  return (
    <div className="fixed top-0 left-0 right-0 flex z-50 pointer-events-none filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.15)]">
      
      {/* Left Half of Screen */}
      <div className="flex-1 flex justify-end min-w-0">
        {/* Notch Left Wing */}
        <div className={`bg-black h-[64px] rounded-bl-[1.5rem] flex items-center pointer-events-auto transition-all duration-300 ${isHome ? 'pl-8 pr-8' : 'pl-10 pr-12'}`}>
          <div className="whitespace-nowrap flex items-center gap-2">
            {leftContent}
          </div>
        </div>
      </div>

      {/* Center Logo (Dead Center of Screen) */}
      <div className="bg-black h-[64px] flex-none flex items-center justify-center pointer-events-auto px-6 z-10">
        <div className="drop-shadow-[0_4px_16px_rgba(255,255,255,0.3)] scale-110">
          {centerContent || <Logo variant="white" className="h-8" />}
        </div>
      </div>

      {/* Right Half of Screen */}
      <div className="flex-1 flex justify-start min-w-0">
        {/* Notch Right Wing */}
        <div className={`bg-black h-[64px] rounded-br-[1.5rem] flex items-center pointer-events-auto transition-all duration-300 ${isHome ? 'pr-8 pl-8' : 'pr-10 pl-12'}`}>
          <div className="whitespace-nowrap flex items-center gap-2 text-[0.85rem] font-semibold">
            {rightContent}
          </div>
        </div>
      </div>

    </div>
  );
}
