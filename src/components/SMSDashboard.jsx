"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TopStats from "./TopStats";
import DownStats from "./DownStats";
import DailySMSChart from "./DailySMSChart";
import ClientEnrollmentChart from "./ClientEnrollmentChart";
import MonthlyCostChart from "./MonthlyCostChart";
import SMSTypePieChart from "./SMSTypePieChart";
import TopRecipients from "./TopRecipients";
import GroupPage from "@/app/contacts/group/page";
import SMSFilesPage from "@/app/sms-files/page";
import BalanceReportPage from "@/app/balance-report/page";

const SMSDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [messageText, setMessageText] = useState("");
  const [recipients, setRecipients] = useState("");
  const [status, setStatus] = useState(null);

  const handleSendSMS = () => {
    if (!messageText.trim() || !recipients.trim()) {
      setStatus("Please enter both recipients and message.");
      return;
    }
    const recipientCount = recipients.split(",").filter((num) => num.trim()).length;
    setStatus(`Message successfully sent to ${recipientCount} recipient(s)!`);
    setMessageText("");
    setRecipients("");
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar Toggle */}
      <button
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 overflow-auto">
        <Header />

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              <TopStats />
              <div className="flex gap-4 overflow-x-auto pb-3">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition whitespace-nowrap">
                  Daily Report
                </button>
                <button className="px-6 py-3 bg-gray-400 text-slate-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-500 transition whitespace-nowrap">
                  Monthly Report
                </button>
              </div>
              <DownStats />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2"><DailySMSChart /></div>
                <ClientEnrollmentChart />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2"><MonthlyCostChart /></div>
                <SMSTypePieChart />
              </div>
              <TopRecipients />
            </>
          )}

          {/* Other Tabs */}
          {activeTab === "groups" && <GroupPage />}
          {activeTab === "batch" && <SMSFilesPage />}
          {activeTab === "balance-report" && <BalanceReportPage />}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Bulk SMS</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recipients</label>
                    <textarea
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      placeholder="e.g. 9851579340, 9813629763"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Characters: {messageText.length}</p>
                  </div>
                  <button
                    onClick={handleSendSMS}
                    className="w-full py-4 bg-linear-to-r from-teal-500 to-blue-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-blue-700 transition shadow-lg"
                  >
                    Send SMS Now
                  </button>
                  {status && (
                    <div className={`p-4 rounded-lg text-center font-medium ${status.includes("success") || status.includes("sent") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSDashboard;
