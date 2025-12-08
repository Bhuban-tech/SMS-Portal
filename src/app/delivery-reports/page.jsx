"use client";

import React, { useState } from "react";
import {
  Search,
  Upload,
  Send,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function SMSReportDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSMS, setSelectedSMS] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  const smsData = [
    {
      id: 1,
      user: "Aadmin National College",
      sentFrom: "Kri_Alert",
      mobileNumber: "9828827258",
      status: "Ncell",
      message:
        "Holiday Tommorrow for all students of Aadmin College, IT Dept",
      totalSmsCount: 2,
      sentAt: "2025/07/24 08:05:48 PM",
    },
    {
      id: 2,
      user: "Aadmin National College",
      sentFrom: "Aadim_Alert",
      mobileNumber: "9826988980",
      status: "Ntc",
      message:
        "Holiday Tommorrow for all students of Aadmin College, IT Dept",
      totalSmsCount: 2,
      sentAt: "2025/07/24 08:05:46 PM",
    },
    {
      id: 3,
      user: "Aadmin National College",
      sentFrom: "Kri_Alert",
      mobileNumber: "9824754558",
      status: "Ntc",
      message:
        "Holiday Tommorrow for all students of Aadmin College, IT Dept",
      totalSmsCount: 2,
      sentAt: "2025/07/24 08:05:45 PM",
    },
  ];


  const getFilteredData = () => {
    let filtered = [...smsData];


    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.mobileNumber.includes(searchTerm) ||
          item.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    if (filterType !== "all") {
      filtered = filtered.filter((item) =>
        item.status.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((item) => item.sentAt.includes(dateFilter));
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  const handleView = (sms) => {
    setSelectedSMS(sms);
    setShowModal(true);
  };

  const handleEdit = (smsId) => {
    console.log("Edit SMS:", smsId);
  };

  const handleDelete = (smsId) => {
    if (confirm("Are you sure you want to delete?")) {
      console.log("Delete:", smsId);
    }
  };


  const handleExport = () => {
    const csv = [
      ["S.N.", "User", "Sent From", "Mobile Number", "Message", "Total SMS Count", "Sent At"],
      ...filteredData.map((item, index) => [
        index + 1,
        item.user,
        item.sentFrom,
        item.mobileNumber,
        item.message,
        item.totalSmsCount,
        item.sentAt,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold"></h1>

                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 border rounded text-sm hover:bg-gray-100"
                  >
                    <Upload className="w-4 h-4" /> 
                  </button>

                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    <Send className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
        
                <div className="flex items-center gap-2">
                  <span className="text-sm"> Filter By date</span>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded text-sm"
                  />
                </div>
                <div className="relative flex-1 min-w-[250px]">
                  <input
                    type="text"
                    placeholder="Search by mobile number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm pr-10"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

              
                {(searchTerm || dateFilter || filterType !== "all") && (
                  <button onClick={resetFilters} className="text-sm text-gray-600">
                    Reset
                  </button>
                )}
              </div>

              <p className="mt-3 text-sm text-gray-600">
                Showing {currentData.length} of {filteredData.length} records
              </p>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {filteredData.length === 0 ? (
                <p className="text-center py-10 text-gray-500">No records found</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-indigo-50">
                        <tr>
                          {["S.N.", "User", "Sent From", "Mobile", "Message", "Count", "Sent At", "Actions"].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase"
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {currentData.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{startIndex + index + 1}</td>
                            <td className="px-4 py-3">{item.user}</td>
                            <td className="px-4 py-3">{item.sentFrom}</td>

                            <td className="px-4 py-3">
                              <div>{item.mobileNumber}</div>
                              <div className="text-xs text-gray-500">{item.status}</div>
                            </td>

                            <td className="px-4 py-5 max-w-md line-clamp-2">
                              {item.message}
                            </td>

                            <td className="px-4 py-3 text-center">
                              {item.totalSmsCount}
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.sentAt}
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleView(item)}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleEdit(item.id)}
                                  className="p-1 text-gray-400 hover:text-green-600"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-between p-4 border-t">
                      <span className="text-sm">Page {currentPage} of {totalPages}</span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`px-3 py-1 border rounded ${
                                currentPage === page
                                  ? "bg-indigo-600 text-white"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>


      {showModal && selectedSMS && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">

            <div className="flex justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">SMS Details</h2>
              <button onClick={() => setShowModal(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                ["User", selectedSMS.user],
                ["Sent From", selectedSMS.sentFrom],
                ["Mobile Number", selectedSMS.mobileNumber],
                ["Status", selectedSMS.status],
                ["Message", selectedSMS.message],
                ["Total SMS Count", selectedSMS.totalSmsCount],
                ["Sent At", selectedSMS.sentAt],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="text-sm font-medium text-gray-600">{label}</label>
                  <p className="mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
