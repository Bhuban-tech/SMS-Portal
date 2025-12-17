'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Calendar, MessageSquare, CheckCircle, XCircle, Clock, Menu, X } from 'lucide-react';

const MonthlyReport = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Sample monthly data
  const monthlyData = [
    { date: 'Week 1', sent: 4520, delivered: 4456, failed: 64 },
    { date: 'Week 2', sent: 5230, delivered: 5180, failed: 50 },
    { date: 'Week 3', sent: 4890, delivered: 4820, failed: 70 },
    { date: 'Week 4', sent: 5670, delivered: 5610, failed: 60 },
  ];

  // Provider distribution data
  const providerData = [
    { name: 'NTC', value: 12450, color: '#14b8a6' },
    { name: 'Ncell', value: 8340, color: '#8b5cf6' },
  ];

  const monthlyStats = {
    total: 20310,
    delivered: 20066,
    failed: 244,
    pending: 0,
    deliveryRate: 98.8
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
      {/* Sidebar toggle button */}
      <button
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab="monthly-report"
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username="Admin" email="admin@example.com" />

        {/* Scrollable content */}
        <div className="p-6 lg:p-8 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Monthly Report</h2>
            <p className="text-gray-600 mt-1">SMS delivery performance overview for the month</p>
          </div>

          {/* Month Selector */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-teal-600" />
              <label className="text-sm font-semibold text-gray-700">Select Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={MessageSquare}
              label="Total Messages"
              value={monthlyStats.total.toLocaleString()}
              color="bg-blue-600"
            />
            <StatCard
              icon={CheckCircle}
              label="Delivered"
              value={monthlyStats.delivered.toLocaleString()}
              subValue={`${monthlyStats.deliveryRate}% success rate`}
              color="bg-green-600"
            />
            <StatCard
              icon={XCircle}
              label="Failed"
              value={monthlyStats.failed.toLocaleString()}
              color="bg-red-600"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={monthlyStats.pending.toLocaleString()}
              color="bg-yellow-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                  <Bar dataKey="delivered" fill="#10b981" name="Delivered" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Provider Pie Chart */}
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

   
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Success Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
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

export default MonthlyReport;
