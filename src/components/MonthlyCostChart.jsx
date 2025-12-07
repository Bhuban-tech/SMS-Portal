"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyCostData = [
  { month: 1, cost: 20 },
  { month: 2, cost: 25 },
  { month: 3, cost: 28 },
  { month: 4, cost: 26 },
  { month: 5, cost: 30 },
  { month: 6, cost: 28 },
  { month: 7, cost: 32 },
  { month: 8, cost: 33 }
];

const MonthlyCostChart = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md">
    <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-4">Monthly SMS Cost (Last 6 Months)</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={monthlyCostData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 90]} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line type="monotone" dataKey="cost" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
    <div className="text-center mt-2">
      <span className="text-xs sm:text-sm text-slate-600">Average: ₹5,5000</span>
    </div>
  </div>
);

export default MonthlyCostChart;
