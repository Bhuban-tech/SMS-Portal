"use client";
import React from 'react';
import { Wallet, MessageSquare, Users, TrendingUp } from 'lucide-react';

const TopStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
      <div className="bg-teal-600 text-white rounded-2xl p-5 lg:p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <span className="text-sm opacity-90">Available Balance</span>
        </div>
        <div className="text-2xl lg:text-3xl font-bold">Rs. 47,975</div>
      </div>

      <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <MessageSquare className="text-cyan-600" size={20} />
          </div>
          <span className="text-sm text-slate-600">Total Contacts</span>
        </div>
        <div className="text-xl lg:text-2xl font-bold text-slate-800">250/300</div>
      </div>

      <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <Users className="text-cyan-600" size={20} />
          </div>
          <span className="text-sm text-slate-600">Total Groups</span>
        </div>
        <div className="text-xl lg:text-2xl font-bold text-slate-800">0</div>
      </div>

      <div className="bg-teal-600 text-white rounded-2xl p-5 lg:p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <span className="text-sm opacity-90">Total Transactions</span>
        </div>
        <div className="text-2xl lg:text-3xl font-bold">Rs. 47,945</div>
      </div>
    </div>
  );
};

export default TopStats;
