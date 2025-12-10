"use client";

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const Header = ({ 
  title, 
  collegeName = "Aadim National College",
  balance = 5000
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
   
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className={`w-full bg-slate-800 shadow-md p-3 sm:p-4 md:p-5 
                       ${isMobile ? "fixed bottom-0 z-50" : "sm:static"}`}>
      <div className="flex flex-row items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white truncate">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-sm sm:text-base font-medium text-white leading-tight truncate max-w-[150px] sm:max-w-[200px]">
              {collegeName}
            </p>
            {balance && (
              <p className="text-xs sm:text-sm text-white mt-0.5 truncate">
                Rs. {balance.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* User icon */}
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 rounded-full flex items-center justify-center shrink-0"
            role="img"
            aria-label="User profile"
          >
            <Users className="text-white" size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
