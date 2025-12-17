'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const DailyReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample daily data - hourly breakdown
  const dailyData = [
    { hour: '00:00', sent: 45, delivered: 43, failed: 2 },
    { hour: '02:00', sent: 28, delivered: 27, failed: 1 },
    { hour: '04:00', sent: 32, delivered: 31, failed: 1 },
    { hour: '06:00', sent: 89, delivered: 87, failed: 2 },
    { hour: '08:00', sent: 156, delivered: 152, failed: 4 },
    { hour: '10:00', sent: 234, delivered: 230, failed: 4 },
    { hour: '12:00', sent: 289, delivered: 285, failed: 4 },
    { hour: '14:00', sent: 267, delivered: 263, failed: 4 },
    { hour: '16:00', sent: 234, delivered: 230, failed: 4 },
    { hour: '18:00', sent: 198, delivered: 195, failed: 3 },
    { hour: '20:00', sent: 178, delivered: 175, failed: 3 },
    { hour: '22:00', sent: 134, delivered: 132, failed: 2 },
  ];

  const providerData = [
    { name: 'NTC', value: 1245, color: '#14b8a6' },
    { name: 'Ncell', value: 834, color: '#8b5cf6' },
  ];

  const dailyStats = {
    total: 1884,
    delivered: 1850,
    failed: 34,
    pending: 0,
    deliveryRate: 98.2,
  };

  const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
          {/* Mobile menu button */}
          <button
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
          >
            {sidebarOpen ? <X size={22} /> : <MessageSquare size={22} />}
          </button>

          {/* Header Title */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Daily Report</h2>
            <p className="text-gray-600 mt-1">SMS delivery performance overview for the day</p>
          </div>

          {/* Date Selector */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <Calendar className="w-5 h-5 text-teal-600" />
              <label className="text-sm font-semibold text-gray-700">
                Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={MessageSquare} label="Total Messages" value={dailyStats.total.toLocaleString()} color="bg-blue-600" />
            <StatCard icon={CheckCircle} label="Delivered" value={dailyStats.delivered.toLocaleString()} subValue={`${dailyStats.deliveryRate}% success rate`} color="bg-green-600" />
            <StatCard icon={XCircle} label="Failed" value={dailyStats.failed.toLocaleString()} color="bg-red-600" />
            <StatCard icon={Clock} label="Pending" value={dailyStats.pending.toLocaleString()} color="bg-yellow-600" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                  <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={providerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {providerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {providerData.map((provider) => (
                  <div key={provider.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }} />
                      <span className="text-sm text-gray-600">{provider.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{provider.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Trend */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Success Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} name="Delivered" />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
