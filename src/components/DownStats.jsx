"use client";
import React from 'react';
import { Send, MessageCircle, UserCheck, TrendingUp } from 'lucide-react';

const DownStats = () => {
  const stats = [
    {
      icon: Send,
      label: "Text Sent",
      value: "250/300",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: MessageCircle,
      label: "Total Text Length",
      value: "38/20",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600"
    },
    {
      icon: UserCheck,
      label: "Total In Sens",
      value: "38",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      icon: TrendingUp,
      label: "Client Enrollments Trend",
      value: "125",
      subtitle: "Clients Enrolled",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={stat.iconColor} size={20} />
              </div>
              <span className="text-sm text-slate-600 font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-slate-800">
              {stat.value}
            </div>
            {stat.subtitle && (
              <div className="text-xs text-slate-500 mt-1">{stat.subtitle}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DownStats;