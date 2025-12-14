import React from "react";
import { Send, CheckCircle, XCircle, Clock } from "lucide-react";

const DownStats = ({ dashboardData }) => {
  const totalSent = dashboardData?.usedSmsCredits || 0;
  const deliveredRate = 95;
  const delivered = Math.floor(totalSent * (deliveredRate / 100));
  const failed = Math.floor(totalSent * 0.02); 
  const pending = totalSent - delivered - failed;

  const stats = [
    {
      title: "Total Sent",
      value: totalSent.toLocaleString(),
      icon: Send,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Delivered",
      value: delivered.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      percentage: `${deliveredRate}%`,
    },
    {
      title: "Failed",
      value: failed.toLocaleString(),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      percentage: "2%",
    },
    {
      title: "Pending",
      value: pending.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      percentage: "3%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`${stat.color} p-2.5 rounded-lg bg-white shadow-sm`}>
                <Icon size={22} />
              </div>
              {stat.percentage && (
                <span className={`${stat.color} text-xs font-bold px-2.5 py-1 rounded-full bg-white shadow-sm`}>
                  {stat.percentage}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DownStats;