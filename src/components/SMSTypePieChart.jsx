"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const smsTypeData = [
  { name: 'Promotional', value: 60, color: '#3B82F6' },
  { name: 'Transactional', value: 25, color: '#14B8A6' },
  { name: 'OTP', value: 15, color: '#06B6D4' }
];

const SMSTypePieChart = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md">
    <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-4">SMS Type Distribution</h3>
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={smsTypeData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {smsTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="mt-4 space-y-2">
      {smsTypeData.map((item, index) => (
        <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
            <span className="text-slate-600">{item.name}</span>
          </div>
          <span className="font-semibold text-slate-800">{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

export default SMSTypePieChart;
