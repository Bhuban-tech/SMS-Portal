"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Eye, Trash2, X } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

export default function DeliveryReports() {
  const params = useParams();
  const recipient_id = params.recipient_id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery-reports");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSMS, setViewSMS] = useState(null);
  const [smsData, setSmsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isClient, setIsClient] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem("token");

   
    if (!recipient_id) {
      toast.error("Invalid recipient ID in URL");
      setLoading(false);
      return;
    }


    if (!token) {
      setError("Authentication token missing. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/message_recipients/${recipient_id}/delivery-reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch: ${res.status} ${errorText || res.statusText}`);
        }

        const data = await res.json();
        setSmsData(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load delivery reports.");
        setSmsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recipient_id, isClient]);

  const filteredData = smsData.filter((item) => {
    const searchMatch =
      (item.user?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.mobileNumber || "").includes(searchTerm);

    const typeMatch =
      filterType === "all" ||
      item.status?.toLowerCase() === filterType.toLowerCase();

    return searchMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  if (!isClient) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Delivery Reports</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by user or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border bg-white px-4 py-2 rounded-xl shadow-sm outline-none w-full md:w-1/3"
            />

            <select
              className="border bg-white px-4 py-2 rounded-xl shadow-sm w-full md:w-1/4"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="delivery">DELIVERY</option>
              <option value="failed">FAILED</option>
            </select>
          </div>

     
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

        
          {loading ? (
            <div className="text-center text-gray-500 mt-8">Loading delivery reports...</div>
          ) : (
            <>
        
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-teal-700 text-white">
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
                      {currentData.length > 0 ? (
                        currentData.map((sms, idx) => (
                          <tr key={sms.id} className="border-b hover:bg-gray-100 transition">
                            <td className="p-3">{startIndex + idx + 1}</td>
                            <td className="p-3">{sms.user || "-"}</td>
                            <td className="p-3">{sms.sentFrom || "-"}</td>
                            <td className="p-3">{sms.mobileNumber}</td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  sms.status?.toLowerCase() === "delivery"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {sms.status}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs truncate">{sms.message}</td>
                            <td className="p-3">{sms.sentAt || "-"}</td>
                            <td className="p-3">
                              <div className="flex justify-center gap-3">
                                <button
                                  onClick={() => setViewSMS(sms)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow transition"
                                  title="View SMS"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition"
                                  title="Delete"
                                  // Add delete handler here if needed
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-gray-500">
                            {smsData.length === 0 && !error
                              ? "No delivery reports found for this recipient."
                              : "No records match your search/filter."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

           
              {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="px-4 py-2 bg-teal-700 text-white rounded-xl shadow">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

  
      {viewSMS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-screen overflow-y-auto">
            <button
              onClick={() => setViewSMS(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">SMS Details</h2>
            <div className="space-y-3 text-left text-gray-700">
              <p><strong>User:</strong> {viewSMS.user || "-"}</p>
              <p><strong>Sent From:</strong> {viewSMS.sentFrom || "-"}</p>
              <p><strong>Mobile Number:</strong> {viewSMS.mobileNumber}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                  viewSMS.status?.toLowerCase() === "delivery"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {viewSMS.status}
                </span>
              </p>
              <p><strong>Message:</strong></p>
              <p className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{viewSMS.message}</p>
              <p><strong>Total SMS Count:</strong> {viewSMS.totalSmsCount ?? "-"}</p>
              <p><strong>Sent At:</strong> {viewSMS.sentAt || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}