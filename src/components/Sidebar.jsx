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
    { id: "groups", icon: Users, label: "Groups", path: "/contacts/groups" },
    { id: "delivery-reports", icon: FileText, label: "Delivery Reports", path: "/delivery-reports" },
    { id: "balance-report", icon: Pen, label: "Balance Report", path: "/balance-report" },
     { id: "send sms", icon: Users, label: "Send SMS", path: "/send-sms" },
    
  ];

  return (
    <>

      <div
        className={`fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

    
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full w-64 z-40 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
          p-6 transform transition-transform duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        
        <div className="mb-12">
          <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight">sms</h1>
        </div>

       
        <nav className="space-y-2 flex flex-col">
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
                  <span className="font-medium truncate">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

  
        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-slate-700 pt-4">
            <button className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-white transition">
              <Settings size={18} />
              <span className="text-sm truncate">Settings</span>
            </button>
          </div>
        </div>
      </aside>


      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-teal-600 text-white rounded-md shadow-lg lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}
    </>
  );
};

export default Sidebar;
