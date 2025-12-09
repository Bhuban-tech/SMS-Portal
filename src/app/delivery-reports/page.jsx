"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Eye, Trash2, X } from "lucide-react";

export default function DeliveryReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery-reports");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSMS, setViewSMS] = useState(null); 
  const itemsPerPage = 10;

  const smsData = [
    { id: 1, user: "Aadim National College", sentFrom: "Kri_Alert", mobileNumber: "9828827258", status: "Ncell", message: "Holiday Tomorrow for all students of Aadim College, IT Dept", totalSmsCount: 2, sentAt: "2025/07/24 08:05:48 PM" },
    { id: 2, user: "Aadim National College", sentFrom: "Aadim_Alert", mobileNumber: "9826988980", status: "Ntc", message: "Holiday Tomorrow for all students of Aadim College, IT Dept", totalSmsCount: 2, sentAt: "2025/07/24 08:05:46 PM" },
    { id: 3, user: "Aadim National College", sentFrom: "Kri_Alert", mobileNumber: "9824754558", status: "Ntc", message: "Holiday Tomorrow for all students of Aadim College, IT Dept", totalSmsCount: 2, sentAt: "2025/07/24 08:05:45 PM" },
  ];

  const filteredData = smsData.filter((item) => {
    const searchMatch =
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobileNumber.includes(searchTerm);

    const typeMatch =
      filterType === "all" || item.status.toLowerCase() === filterType.toLowerCase();

    return searchMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

        
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by mobile number..."
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
              <option value="ncell">Ncell</option>
              <option value="ntc">Ntc</option>
            </select>
          </div>

         
          <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
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
                {currentData.map((sms, idx) => (
                  <tr key={sms.id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">{startIndex + idx + 1}</td>
                    <td className="p-3">{sms.user}</td>
                    <td className="p-3">{sms.sentFrom}</td>
                    <td className="p-3">{sms.mobileNumber}</td>
                    <td className="p-3">{sms.status}</td>
                    <td className="p-3">{sms.message}</td>
                    <td className="p-3">{sms.sentAt}</td>

                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setViewSMS(sms)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

       <div className="flex justify-end items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-100"
            >
              Prev
            </button>

            <span className="px-4 py-2 bg-white border rounded-xl shadow">{currentPage}</span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-white border rounded-xl shadow hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </main>
      </div>

  
      {viewSMS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setViewSMS(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">SMS Details</h2>

            <div className="space-y-2 text-left">
              <p><strong>User:</strong> {viewSMS.user}</p>
              <p><strong>Sent From:</strong> {viewSMS.sentFrom}</p>
              <p><strong>Mobile Number:</strong> {viewSMS.mobileNumber}</p>
              <p><strong>Status:</strong> {viewSMS.status}</p>
              <p><strong>Message:</strong> {viewSMS.message}</p>
              <p><strong>Total SMS Count:</strong> {viewSMS.totalSmsCount}</p>
              <p><strong>Sent At:</strong> {viewSMS.sentAt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
