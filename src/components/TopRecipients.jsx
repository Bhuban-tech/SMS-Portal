"use client";
import React from 'react';
import { FileText } from 'lucide-react';

const recipientsData = [
  { name: 'No1', count: 10 },
  { name: '35', count: 14 },
  { name: '86', count: 16 },
  { name: '190', count: 20 },
  { name: '963', count: 22 },
  { name: '113.9', count: 22 }
];

const TopRecipients = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md">
    <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-4">Top 5 Recipients by SMS Count</h3>
    <div className="flex items-end justify-between h-32 sm:h-40 gap-2">
      {recipientsData.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div 
            className="w-full bg-teal-500 rounded-t-lg transition-all hover:bg-teal-600"
            style={{ height: `${(item.count / 22) * 100}%` }}
          ></div>
          <span className="text-xs text-slate-600 font-medium">{item.name}</span>
        </div>
      ))}
    </div>
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <FileText className="text-blue-600" size={20} />
      </div>
      <div className="text-center sm:text-left">
        <div className="text-lg font-bold text-slate-800">SMS Text Cost Per Client</div>
        <div className="text-sm text-slate-600">Data based on SMS usage by top recipients</div>
      </div>
    </div>
  </div>
);

export default TopRecipients;
