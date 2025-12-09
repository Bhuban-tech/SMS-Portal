"use client";

import React from "react";
import {
  MessageSquare,
  Users,
  LayoutDashboard,
  Settings,
  FileText,
  File,
  Pen,
} from "lucide-react";
import Link from "next/link";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { id: "messages", icon: MessageSquare, label: "Individual Contact", path: "/contacts/individual-contact" },
    { id: "batch", icon: File, label: "SMS Files", path: "/sms-files" },
    { id: "groups", icon: Users, label: "Groups", path: "/contacts/group" },
    { id: "delivery-reports", icon: FileText, label: "Delivery Reports", path: "/delivery-reports" },
    { id: "balance-report", icon: Pen, label: "Balance Report", path: "/balance-report" },
  ];

  return (
    <>
     
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

  
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:relative w-64
          bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
          p-6 h-full z-40 transition-transform duration-300 ease-in-out shadow-2xl
        `}
      >
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-white text-5xl font-bold tracking-tight">sms</h1>
        </div>

        {/* Menu items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Link key={item.id} href={item.path}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-slate-700 pt-4">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-white transition">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
