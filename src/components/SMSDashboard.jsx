"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TopStats from "./TopStats";
import DownStats from "./DownStats";
import DailySMSChart from "./DailySMSChart";
import ClientEnrollmentChart from "./ClientEnrollmentChart";
import MonthlyCostChart from "./MonthlyCostChart";
import SMSTypePieChart from "./SMSTypePieChart";
import TopRecipients from "./TopRecipients";
import GroupPage from "@/app/contacts/groups/page";
import SMSFilesPage from "@/app/sms-files/page";
import BalanceReportPage from "@/app/balance-report/page";
import { useRouter } from "next/navigation";

const SMSDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messageText, setMessageText] = useState("");
  const [recipients, setRecipients] = useState("");
  const [status, setStatus] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const adminId = localStorage.getItem('adminId');
        
        console.log('Token:', token ? 'exists' : 'missing');
        console.log('AdminId:', adminId);
        
        if (!token || !adminId) {
          setError("Authentication required. Please login.");
          setLoading(false);
          return;
        }

        const apiUrl = `${API_BASE_URL}${ENDPOINTS.GET_ADMIN(adminId)}`;
        console.log('Fetching from:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          if (response.status === 401) {
            setError("Session expired. Redirecting to login...");
            setTimeout(() => {
              localStorage.clear();
              window.location.href = '/login';
            }, 2000);
            return;
          }
          
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.success) {
          setDashboardData(result.data);
          setError(null);
        } else {
          setError(result.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const router = useRouter();
 


  return (
    <div className="flex h-screen bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
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

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <Header username={dashboardData?.username} email={dashboardData?.email} />

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg shadow-md">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">Error loading dashboard</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <TopStats dashboardData={dashboardData} />
                  <div className="flex gap-4 overflow-x-auto pb-3">
                    <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold shadow-md hover:bg-teal-700 transition whitespace-nowrap"
                      onClick={() => router.push('/daily-reports')}>
                      Daily Report
                    </button>
                    <button className="px-6 py-3 bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-300 transition whitespace-nowrap"
                     onClick={() => router.push('/monthly-reports')}
                    >
                      Monthly Report
                    </button>
                  </div>
                  <DownStats dashboardData={dashboardData} />
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
            </>
          )}

          {activeTab === "groups" && <GroupPage />}
          {activeTab === "batch" && <SMSFilesPage />}
          {activeTab === "balance-report" && <BalanceReportPage />}

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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Characters: {messageText.length}</p>
                  </div>
                  <button
                    onClick={handleSendSMS}
                    className="w-full py-4 bg-linear-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to--700 transition shadow-lg"
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