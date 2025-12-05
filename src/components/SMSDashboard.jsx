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


const contactsData = [
  { id: 1, name: "Bhuban", mobile: "9851579340", groups: ["BBA", "CSIT", "BCA"] },
  { id: 2, name: "Himla", mobile: "9851965462", groups: ["BBA", "CSIT"] },
  { id: 3, name: "Pemba Mainali", mobile: "9813629763", groups: ["BCA"] },
  { id: 4, name: "Himla Dhakal", mobile: "9761758529", groups: ["CSIT"] },
];


const allGroups = [...new Set(contactsData.flatMap(c => c.groups))];


const SAMPLE_REPORTS = [
  {
    id: 1,
    message_content: "Admission is open for 2025",
    phone_no: "+1234566790",
    status: "DELIVERED",
    sent_at: "2025-11-01T09:00:00Z",
    delivered_at: "2025-11-01T09:01:00Z",
  },
  {
    id: 2,
    message_content: "Fees deadline extended",
    phone_no: "+1987654321",
    status: "FAILED",
    sent_at: "2025-11-02T10:30:00Z",
    delivered_at: null,
  },
  {
    id: 3,
    message_content: "New courses available",
    phone_no: "+1122334455",
    status: "PENDING",
    sent_at: "2025-11-03T11:00:00Z",
    delivered_at: null,
  },
  {
    id: 4,
    message_content: "Holiday notice",
    phone_no: "+1555666777",
    status: "DELIVERED",
    sent_at: "2025-12-01T14:20:00Z",
    delivered_at: "2025-12-01T14:21:00Z",
  },
  {
    id: 5,
    message_content: "Exam schedule released",
    phone_no: "+1444555666",
    status: "FAILED",
    sent_at: "2025-12-02T08:45:00Z",
    delivered_at: null,
  },
];

const SMSDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");


  const [messageText, setMessageText] = useState("");
  const [recipients, setRecipients] = useState("");
  const [status, setStatus] = useState(null);


  const [filters, setFilters] = useState({
    message: "",
    status: "ALL",
    dateFrom: "",
    dateTo: "",
  });
  const [retryingId, setRetryingId] = useState(null);


  const filteredContacts = contactsData.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.mobile.includes(term) ||
      c.groups.some((g) => g.toLowerCase().includes(term))
    );
  });

  const groupContacts = (groupName) =>
    contactsData.filter((c) => c.groups.includes(groupName));

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

  const filteredReports = SAMPLE_REPORTS.filter((report) => {
    if (filters.message && !report.message_content.toLowerCase().includes(filters.message.toLowerCase()))
      return false;
    if (filters.status !== "ALL" && report.status !== filters.status) return false;
    if (filters.dateFrom && new Date(report.sent_at) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(report.sent_at) > new Date(filters.dateTo)) return false;
    return true;
  });

  const handleRetry = (id) => {
    setRetryingId(id);
    setTimeout(() => {
      alert(`Retry triggered for message ID: ${id} (simulated)`);
      setRetryingId(null);
    }, 1500);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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

    
      <div className="flex-1 overflow-auto">
        <Header />

        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      
          {activeTab === "dashboard" && (
            <>
              <TopStats />
              <div className="flex gap-4 overflow-x-auto pb-3">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition whitespace-nowrap">
                  Daily Report
                </button>
                <button className="px-6 py-3 bg-gray-400 text-slate-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition whitespace-nowrap">
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

       
          {activeTab === "contacts" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Individual Contacts</h2>
                <input
                  type="text"
                  placeholder="Search by name, mobile, or group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-linear-to-r from-blue-50 to-teal-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.N</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mobile Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Groups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 border-b">
                        <td className="px-6 py-4 text-sm">{contact.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{contact.name}</td>
                        <td className="px-6 py-4 text-sm">{contact.mobile}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.groups.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === "groups" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800">Groups</h2>
              {allGroups.map((groupName) => {
                const members = groupContacts(groupName);
                return (
                  <div key={groupName} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 bg-linear-to-r from-teal-500 to-blue-600 text-white">
                      <h3 className="text-xl font-bold">{groupName} ({members.length} members)</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.N</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mobile</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((member, idx) => (
                            <tr key={member.id} className="hover:bg-gray-50 border-b">
                              <td className="px-6 py-4 text-sm">{idx + 1}</td>
                              <td className="px-6 py-4 text-sm font-medium">{member.name}</td>
                              <td className="px-6 py-4 text-sm">{member.mobile}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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

          
          {activeTab === "delivery-reports" && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-slate-800">Delivery Reports</h2>
              </div>

              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Message contains..."
                    value={filters.message}
                    onChange={(e) => handleFilterChange("message", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="FAILED">Failed</option>
                    <option value="PENDING">Pending</option>
                  </select>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Delivered At</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No reports found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">{report.id}</td>
                          <td className="px-6 py-4 text-sm max-w-xs truncate" title={report.message_content}>
                            {report.message_content}
                          </td>
                          <td className="px-6 py-4 text-sm">{report.phone_no}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                report.status === "DELIVERED"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "FAILED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(report.sent_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {report.delivered_at ? new Date(report.delivered_at).toLocaleString() : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {report.status === "FAILED" ? (
                              <button
                                onClick={() => handleRetry(report.id)}
                                disabled={retryingId === report.id}
                                className="text-teal-600 hover:text-teal-800 font-medium disabled:opacity-50"
                              >
                                {retryingId === report.id ? "Retrying..." : "Retry"}
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SMSDashboard;