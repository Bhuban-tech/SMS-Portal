import { Download, Edit, Filter, Search, Trash2 } from "lucide-react";
import { useState } from "react";

function SMSFilesPage() {
  const [search, setSearch] = useState("");

  const data = [
    { sn: 1, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 2, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 3, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 4, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 5, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 6, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
  ];

  return (
    <div className="p-6 w-full space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">SMS Files</h1>

      {/* Top Controls */}
      <div className="flex justify-between items-center">
        {/* Search */}
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 shadow-sm text-sm outline-none"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-teal-500 text-white font-semibold hover:bg-teal-600 cursor-pointer rounded-lg shadow flex items-center gap-2">
            ADD FILES
          </button>

          <button className="rounded-lg px-3 py-2 border shadow-sm hover:bg-gray-100">
            <Filter className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-xl p-4 overflow-x-auto">
        <table className="w-full text-sm rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-teal-700 text-white text-center">
              <th className="p-3">S.N</th>
              <th className="p-3">Author</th>
              <th className="p-3">File Name</th>
              <th className="p-3">File Type</th>
              <th className="p-3">Size</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.sn}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}
              >
                <td className="p-3">{row.sn}</td>
                <td className="p-3">{row.author}</td>
                <td className="p-3">{row.fileName}</td>
                <td className="p-3">{row.fileType}</td>
                <td className="p-3">{row.size}</td>
                <td className="p-3">{row.createdAt}</td>

                {/* Actions */}
                <td className="p-3 flex gap-3 justify-center">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow">
                    <Download className="w-4 h-4" />
                  </button>

                  <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow">
                    <Edit className="w-4 h-4" />
                  </button>

                  <button className="bg-red-400 hover:bg-red-600 text-white p-2 rounded-full shadow">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SMSFilesPage;
