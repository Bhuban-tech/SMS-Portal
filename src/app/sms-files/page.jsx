import { Download, Edit, Filter, RefreshCcw, Search, Trash2 , } from "lucide-react";
import { useState } from "react";
function SMSFilesPage() {
    const [search, setSearch] = useState("");
    const data = [
        {sn:1,
         author:"Aadim National College",
         fileName: "SEE-Student",
         fileType:"csv",
         size:"50.03 KB",
         createdAt:"2025/07/24 - 7:50:55 pm"
        },

         {sn:2,
         author:"Aadim National College",
         fileName: "SEE-Student",
         fileType:"csv",
         size:"50.03 KB",
         createdAt:"2025/07/24 - 7:50:55 pm"
        },

         {sn:3,
         author:"Aadim National College",
         fileName: "SEE-Student",
         fileType:"csv",
         size:"50.03 KB",
         createdAt:"2025/07/24 - 7:50:55 pm"
        },

         {sn:4,
         author:"Aadim National College",
         fileName: "SEE-Student",
         fileType:"csv",
         size:"50.03 KB",
         createdAt:"2025/07/24 - 7:50:55 pm"
        },
        {sn:5,
         author:"Aadim National College",
         fileName: "SEE-Student",
         fileType:"csv",
         size:"50.03 KB",
         createdAt:"2025/07/24 - 7:50:55 pm"
        },
        {sn:6,
         author:"Aadim National College",
         fileName: "SEE-Student",
         fileType:"csv",
         size:"50.03 KB",
         createdAt:"2025/07/24 - 7:50:55 pm"
        },
    ];
    return (
  <div className="p-6 w-full space-y-4">
    <h1 className="text-2xl font-semibold">SMS Files</h1>

 
    <div className="flex justify-between items-center">
      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-2 pl-10 pr-4 outline-none"
        />
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
      </div>

      <div className="flex gap-3">
        <button className="rounded-xl px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 cursor-pointer">
          ADD FILES
        </button>

        <button className="rounded-xl px-3 py-2 border">
          <Filter className="w-4 h-4" />
        </button>

        {/* <button className="rounded-xl px-3 py-2 border">
          <RefreshCcw className="w-4 h-4" />
        </button> */}
      </div>
    </div>

  
    <div className="rounded-2xl shadow-sm border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-400 text-gray-900">
          <tr>
            <th className="p-3 text-center">S.N</th>
            <th className="p-3 text-center">Author</th>
            <th className="p-3 text-center">File Name</th>
            <th className="p-3 text-center">File Type</th>
            <th className="p-3 text-center">Size</th>
            <th className="p-3 text-center">Created At</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.sn} className="border-b hover:bg-gray-50">
              <td className="p-3 text-center">{row.sn}</td>
              <td className="p-3 text-center">{row.author}</td>
              <td className="p-3 text-center">{row.fileName}</td>
              <td className="p-3 text-center">{row.fileType}</td>
              <td className="p-3 text-center">{row.size}</td>
              <td className="p-3 text-center">{row.createdAt}</td>
              <td className="p-3 flex gap-3 justify-center">
                <Download className="w-4 h-4 cursor-pointer text-blue-600" />
                <Edit className="w-4 h-4 cursor-pointer text-green-600" />
                <Trash2 className="w-4 h-4 cursor-pointer text-red-600" />
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