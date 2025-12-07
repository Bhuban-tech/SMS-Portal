"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const clientEnrollmentData = [
  { point: 1, value: 43 },
  { point: 2, value: 45 },
  { point: 3, value: 47 },
  { point: 4, value: 48 },
  { point: 5, value: 50 }
];

const ClientEnrollmentChart = () => (
  <div className="bg-white rounded-xl p-4 lg:p-6 shadow-md">
    <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-4">Client Enrolment Trend</h3>
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={clientEnrollmentData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="point" hide />
        <YAxis domain={[40, 52]} hide />
        <Line type="monotone" dataKey="value" stroke="#14B8A6" strokeWidth={3} dot={{ fill: '#14B8A6', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
    <div className="mt-4 text-center">
      <div className="text-sm text-slate-600 mb-1">Clients Enrolled</div>
      <div className="text-2xl lg:text-3xl font-bold text-slate-800">125</div>
    </div>
  </div>
);

export default ClientEnrollmentChart;
