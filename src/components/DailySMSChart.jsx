"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailySMSData = [
  { day: 'Dec 1', value: 80 },
  { day: 'Dec 2', value: 130 },
  { day: 'Dec 3', value: 20 },
  { day: 'Dec 4', value: 45 },
  { day: 'Dec 5', value: 75 },
  { day: 'Dec 6', value: 100 },
  { day: 'Dec 7', value: 145 },
  { day: 'Dec 8', value: 60 },
  { day: 'Dec 9', value: 85 }
];

const DailySMSChart = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md">
    <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-4">Daily SMS Sent Volume</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={dailySMSData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default DailySMSChart;
