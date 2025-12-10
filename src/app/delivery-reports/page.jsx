"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Eye, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    toast.error("Please login again");
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export default function DeliveryReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery-reports");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSMS, setViewSMS] = useState(null);
  const [smsData, setSmsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  const fetchDeliveryReports = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/delivery_reports`;
      const response = await fetchWithAuth(url);

      const reports = response?.data || response || [];

      setSmsData(Array.isArray(reports) ? reports : []);
      
      if (reports.length === 0) {
        toast.info("No delivery reports found.");
      } else {
        toast.success(`Loaded ${reports.length} report(s)`);
      }
    } catch (error) {
      console.error("Failed to load delivery reports:", error);
      
      if (error.message.includes("404")) {
        toast.error("Delivery reports endpoint not found. Contact admin.");
      } else if (error.message.includes("403")) {
        toast.error("You don't have permission to view delivery reports.");
      } else {
        toast.error("Failed to load reports");
      }
      setSmsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryReports();
  }, []);

  const filteredData = smsData.filter((item) => {
    const search = searchTerm.toLowerCase();
    const mobile = (item.mobile_number || "").toLowerCase();
    const user = (item.user?.name || item.user || "").toLowerCase();

    const searchMatch = mobile.includes(search) || user.includes(search);
    const statusMatch = filterType === "all" || (item.status || "").toLowerCase() === filterType;

    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-gray-50 shadow">
          <Header title="Delivery Reports" />
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          {loading && (
            <p className="text-center text-blue-600 font-medium">Loading your delivery reports...</p>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by mobile or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border bg-white px-4 py-2 rounded-xl shadow-sm outline-none w-full md:w-96"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border bg-white px-4 py-2 rounded-xl shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            <button
              onClick={fetchDeliveryReports}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            >
              Reload
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-teal-700 text-white sticky top-0">
                <tr>
                  <th className="p-3">S.N</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Sent From</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Sent At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="p-12 text-gray-500">
                      No delivery reports available
                    </td>
                  </tr>
                )}

                {currentData.map((sms, idx) => (
                  <tr key={sms.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">{startIndex + idx + 1}</td>
                    <td className="p-3">{sms.user?.name || sms.user || "-"}</td>
                    <td className="p-3">{sms.sent_from || "-"}</td>
                    <td className="p-3">{sms.mobile_number}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sms.status === "delivered" ? "bg-green-100 text-green-800" :
                        sms.status === "failed" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {sms.status || "unknown"}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate" title={sms.message || sms.content}>
                      {sms.message || sms.content || "-"}
                    </td>
                    <td className="p-3">
                      {sms.sent_at ? new Date(sms.sent_at).toLocaleString() : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setViewSMS(sms)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-5 py-2 bg-white border rounded-xl shadow">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-white border rounded-xl shadow hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* View Modal */}
      {viewSMS && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setViewSMS(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">SMS Delivery Report</h2>
            <div className="space-y-3 text-left">
              <p><strong>User:</strong> {viewSMS.user?.name || viewSMS.user}</p>
              <p><strong>Sent From:</strong> {viewSMS.sent_from}</p>
              <p><strong>Mobile:</strong> {viewSMS.mobile_number}</p>
              <p><strong>Status:</strong> <span className="font-bold text-blue-600">{viewSMS.status}</span></p>
              <p><strong>Message:</strong></p>
              <p className="bg-gray-50 p-3 rounded-lg text-sm">{viewSMS.message || viewSMS.content}</p>
              <p><strong>Sent At:</strong> {new Date(viewSMS.sent_at || viewSMS.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}