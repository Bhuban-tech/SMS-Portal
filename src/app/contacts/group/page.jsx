// import GroupsTable from "@/components/contact/group";
// import GroupsTable from "@/components/contact/group";
import { Search, Plus, Eye, Edit, Delete, DeleteIcon, Trash } from "lucide-react";

function GroupPage() {
    const groups=[
        {id:1, name:"BCA 2080 Batch", total:0},
        {id:2, name:"BCA 2079 Batch", total:0},
        {id:3, name:"BCA 2078 Batch", total:0},
        {id:4, name:"BCA 2077 Batch", total:0},
        {id:5, name:"BCA 2076 Batch", total:0},

    ];
    return(
        <div className="p-6 flex-1">
           
               <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Groups</h2>
        <div className="flex justify-between items-center mb-6">
      
            <div className="relative w-60">
        <input
            type="text"
            placeholder="Search"
            className="border rounded-lg px-3 py-2 pr-10 text-sm w-full"/>
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
             <Search className="w-4 h-4" />
        </span>
            </div>


            <button className="px-5 py-2 bg-teal-500 text-white font-semibold hover:bg-teal-700 cursor-pointer rounded-lg">Add Group</button>
            </div>
            <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-lg">
                <table className="w-full border rounded-xl overflow-hidden">
                    <thead className="bg-teal-400 text-center text-sm font-semibold text-gray-800">
                        <tr>
                            <th className="px-6 py-4">S.N</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Total Contacts</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {groups.map((g, index) => (
                            <tr key ={g.id} className={`border -b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} `}>
                                <td className="px-6 py-4 text-sm text-center">{index+1}</td>
                                <td className="px-6 py-4 text-sm text-center">{g.name}</td>
                                <td className="px-6 py-4 text-center">{g.total}</td>
                               
                               <td className="px-6 py-4 flex gap-3 justify-center">
                                <button className="bg-blue-400 text-white px-2 py-1 rounded cursor-pointer hover:bg-blue-800"><Plus className="w-4 h-4" /></button>
                                <button className="bg-gray-300 px-2 py-1 rounded cursor-pointer hover:bg-gray-600"><Eye className="w-4 h-4" /></button>
                                <button className="bg-green-400 text-white px-2 py-1 rounded cursor-pointer hover:bg-green-800">  <Edit className="w-4 h-4" /></button>
                                <button className="bg-red-300 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600"> <Trash className="w-4 h-4" /></button>
                               </td>
                               </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
        </div>
    )
}
export default GroupPage;