"use client";
import React from "react";
import { Users } from "lucide-react";

const Header = ({
  collegeName = "Aadim National College",
  balance = 5000,
  avatarIcon = <Users size={20} className="text-white" />,
  bgColor = "bg-white",
}) => {
  return (
    <header
      className={`${bgColor} w-full rounded-xl shadow-md p-4 lg:p-5 flex flex-col lg:flex-row items-center justify-between`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
      </div>

      <div className="flex items-center gap-4 mt-3 lg:mt-0">

        <div className="text-right">
           <p className="text-sm lg:text-base text-slate-600">{collegeName}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Rs. {balance.toLocaleString()}
          </p>
        </div>


        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
          {avatarIcon}
        </div>
      </div>
    </header>
  );
};

export default Header;
