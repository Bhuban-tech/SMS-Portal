"use client";

import React, { useState } from "react";
import { Calendar, Filter, Upload } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

 function BalanceReportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("balance-report");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");

  const data = [
    { sn: 1, date: "2025-07-24", particular: "BULK SMS", dr: "-1140", cr: "-", balance: "255.31", attachment: "-", user: "Aadim National College", sourceRemark: "-" },
    { sn: 2, date: "2025-07-24", particular: "GROUP SMS", dr: "-500", cr: "-", balance: "400.00", attachment: "-", user: "Aadim National College", sourceRemark: "-" },
    { sn: 3, date: "2025-07-24", particular: "SINGLE SMS", dr: "-2", cr: "-", balance: "398.00", attachment: "-", user: "Aadim National College", sourceRemark: "-" }
  ];

  const filteredData = data.filter((row) => {
    const matchDate = filterDate ? row.date === filterDate : true;
    const matchType = filterType ? row.particular.toLowerCase().includes(filterType) : true;
    return matchDate && matchType;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <div className="sticky top-0 z-30 bg-gray-50 shadow">
          <Header title="Balance Report" />
        </div>

        {/* <div className="bg-gray-100 p-4 ">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Balance Report</h2>
    </div> */}

        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
        
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
              <Calendar className="w-5 h-5" />
              <input
                type="date"
                className="outline-none"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
              <Filter className="w-5 h-5" />
              <select
                className="outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Filter by Type</option>
                <option value="bulk">Bulk SMS</option>
                <option value="group">Group SMS</option>
                <option value="single">Single SMS</option>
              </select>
            </div>

            <div className="ml-auto flex gap-3 flex-wrap">
              <button className="bg-teal-600 px-4 py-2 text-white rounded-xl shadow hover:bg-teal-700">
                Load Balance
              </button>
              <button className="px-3 py-2 border rounded hover:bg-gray-100 shadow flex items-center gap-2">
                <Upload size={16} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
            <table className="w-full text-sm text-center min-w-[900px] md:min-w-full">
              <thead className="bg-teal-700 text-white sticky top-0">
                <tr>
                  <th className="p-3">S.N</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Particular</th>
                  <th className="p-3">Dr</th>
                  <th className="p-3">Cr</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Attachment</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Source Remark</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row) => (
                  <tr
                    key={row.sn}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{row.sn}</td>
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.particular}</td>
                    <td className="p-3 text-red-700">{row.dr}</td>
                    <td className="p-3 text-green-700">{row.cr}</td>
                    <td className="p-3">{row.balance}</td>
                    <td className="p-3">{row.attachment}</td>
                    <td className="p-3">{row.user}</td>
                    <td className="p-3">{row.sourceRemark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
export default BalanceReportPage;