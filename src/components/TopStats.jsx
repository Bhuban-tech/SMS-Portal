import React from "react";
import { CreditCard, TrendingUp, TrendingDown, Activity } from "lucide-react";

const TopStats = ({ dashboardData }) => {
  const usagePercentage = dashboardData 
    ? ((dashboardData.usedSmsCredits / dashboardData.totalSmsCredits) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total SMS Credits",
      value: dashboardData?.totalSmsCredits?.toLocaleString() || "0",
      icon: CreditCard,
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600",
      iconBg: "bg-blue-400/30",
      trend: null,
    },
    {
      title: "Used SMS Credits",
      value: dashboardData?.usedSmsCredits?.toLocaleString() || "0",
      icon: TrendingUp,
      bgColor: "bg-white",
      iconBg: "bg-teal-500",
      trend: `${usagePercentage}% used`,
      trendColor: "text-black",
    },
    {
      title: "Remaining Credits ",
      value: dashboardData?.remainingCredits?.toLocaleString() || "0",
      icon: TrendingDown,
      bgColor: "bg-gradient-to-br from-white-500 to-green-white",
      iconBg: "bg-teal-500",
      trend: `${(100 - usagePercentage).toFixed(1)}% available bg`,
      trendColor: "text-teal-500",
    },
    {
      title: "Account Status",
      value: dashboardData?.remainingCredits > 0 ? "Active" : "Depleted",
      icon: Activity,
      bgColor: "bg-gradient-to-br from-teal-500 to-teal-600",
      iconBg: "bg-purple-400/30",
      trend: dashboardData?.email || "No email",
      trendColor: "text-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <Icon size={24} />
              </div>
              {stat.trend && (
                <span className={`text-xs font-medium ${stat.trendColor} bg-white/20 px-3 py-1 rounded-full`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TopStats;