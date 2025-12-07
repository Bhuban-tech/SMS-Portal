"use client";
import React from 'react';
import { Users } from 'lucide-react';

const Header = ({ 
  title = "SMS Dashboard", 
  collegeName = "Aadim national college",
  balance 
}) => {
  return (
    <header className="w-full bg-white rounded-xl shadow-md p-4 lg:p-5">
      <div className="flex items-center justify-between">
        
        <h1 className="text-lg font-semibold text-slate-700">
          {title}
        </h1>

       
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600 leading-tight">
              {collegeName}
            </p>
            {balance && (
              <p className="text-xs text-slate-500 mt-0.5">
                Rs. {balance.toLocaleString()}
              </p>
            )}
          </div>

          <div 
            className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0"
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