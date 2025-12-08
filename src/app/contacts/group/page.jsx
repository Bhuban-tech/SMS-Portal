import { Search, Plus, Eye, Edit, Trash } from "lucide-react";

function GroupPage() {
  const groups = [
    { id: 1, name: "BCA 2080 Batch", total: 0 },
    { id: 2, name: "BCA 2079 Batch", total: 0 },
    { id: 3, name: "BCA 2078 Batch", total: 0 },
    { id: 4, name: "BCA 2077 Batch", total: 0 },
    { id: 5, name: "BCA 2076 Batch", total: 0 },
  ];

  return (
    <div className="p-6 flex-1">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Groups</h2>

      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm w-full focus:outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <button className="px-5 py-2 bg-teal-500 text-white font-semibold hover:bg-teal-600 cursor-pointer rounded-lg shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Group
        </button>
      </div>

     
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-4">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-teal-700 text-white text-sm font-semibold text-center">
              <th className="px-6 py-4">S.N</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Total Contacts</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {groups.map((g, index) => (
              <tr
                key={g.id}
                className={`text-center ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">{g.name}</td>
                <td className="px-6 py-4 text-sm">{g.total}</td>

                <td className="px-6 py-4 flex items-center justify-center gap-3">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow">
                    <Plus className="w-4 h-4" />
                  </button>

                  <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow">
                    <Eye className="w-4 h-4" />
                  </button>

                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow">
                    <Edit className="w-4 h-4" />
                  </button>

                  <button className="bg-red-400 hover:bg-red-600 text-white p-2 rounded-full shadow">
                    <Trash className="w-4 h-4" />
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

export default GroupPage;
