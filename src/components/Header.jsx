"use client";
import React from "react";
import { Users } from "lucide-react";

const Header = ({
  title = "SMS Dashboard",
  collegeName = "Aadim national college",
  balance,
}) => {
  return (
    <header className="
      w-full 
     
      shadow-lg 
      px-6 py-4 
      bg-slate-800    
    ">
      <div className="flex items-center justify-between">

      
        <h1 className="text-xl font-semibold text-white">
          {title}
        </h1>

        
        <div className="flex items-center gap-4">

         
          <div className="text-right text-white">
            <p className="text-sm font-medium">{collegeName}</p>
            {balance && (
              <p className="text-xs mt-0.5">Rs. {balance.toLocaleString()}</p>
            )}
          </div>

     
          <div className="
            w-10 h-10 
            rounded-full 
            bg-teal-500 
            flex items-center justify-center
            shadow-md
          ">
            <Users className="text-white" size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
