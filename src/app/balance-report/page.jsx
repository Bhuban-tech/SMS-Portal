import { Calendar, Filter, Upload } from "lucide-react";
import { useState } from "react";

function BalanceReportPage() {
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");

  const data = [
    { sn: 1, date: "2025-07-24 7:59:55 PM", particular: "BULK SMS", dr: "-1140", cr: "-", balance: "255.31", attachment: "-", user: "Aadim National College", sourceRemark: "-" },
    { sn: 2, date: "2025-07-24 7:59:55 PM", particular: "BULK SMS", dr: "-1140", cr: "-", balance: "255.31", attachment: "-", user: "Aadim National College", sourceRemark: "-" },
    { sn: 3, date: "2025-07-24 7:59:55 PM", particular: "BULK SMS", dr: "-1140", cr: "-", balance: "255.31", attachment: "-", user: "Aadim National College", sourceRemark: "-" },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800">Balance Report</h1>

    
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
          <Calendar className="w-5 h-5 text-gray-600" />
          <input
            type="date"
            className="outline-none text-gray-700"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            className="outline-none text-gray-700"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Filter by Type</option>
            <option value="bulk">Bulk SMS</option>
            <option value="group">Group SMS</option>
            <option value="single">Single SMS</option>
          </select>
        </div>

        <div className="ml-auto flex gap-3">
          <button className="bg-teal-600 px-4 py-2 text-white rounded-xl shadow hover:bg-teal-700 cursor-pointer">
            Load Balance
          </button>

          <button className="bg-teal-600 px-3 py-2 text-white rounded-xl shadow hover:bg-teal-700 cursor-pointer">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
        <table className="w-full text-sm text-center rounded-xl overflow-hidden">

         
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Date</th>
              <th className="p-3">Particular</th>
              <th className="p-3 text-red-200">Dr</th>
              <th className="p-3 text-green-200">Cr</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Attachment</th>
              <th className="p-3">User</th>
              <th className="p-3">Source Remark</th>
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b last:border-none`}
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

    </div>
  );
}

export default BalanceReportPage;
