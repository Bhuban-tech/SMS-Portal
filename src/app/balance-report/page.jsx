const { Calendar, Filter, Upload } = require("lucide-react");
const { useState } = require("react");

function BalanceReportPage() {
    const [filterDate, setfilterDate] = useState("");
    const [filterType, setfilterType]= useState ("");

    const data =[
        {sn:1, date:"2025-07-24 7:59:55 PM", particular:"BULK SMS", dr:"-1140", cr:"-", balance:"255.31", attachment:"-" , user:"Aadim National College", sourceRemark:"-"},
        {sn:2, date:"2025-07-24 7:59:55 PM", particular:"BULK SMS", dr:"-1140", cr:"-", balance:"255.31", attachment:"-" , user:"Aadim National College", sourceRemark:"-"},
        {sn:3, date:"2025-07-24 7:59:55 PM", particular:"BULK SMS", dr:"-1140", cr:"-", balance:"255.31", attachment:"-" , user:"Aadim National College", sourceRemark:"-"},
    ];
    return(
       <div className="p-6 min-h-screen">
        <h1 className="text-2xl text-gray-800 font-bold mb-6">Balance Report</h1>
        <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow border w-fit">
                <Calendar className="w-4 h-4"/>
                <input type="date"
                       className="outline-none text-gray-700"
                       value={filterDate}
                       onChange={(e)=>setfilterDate(e.target.value)} />
            </div>

            <div className="bg-white- p-3 rounded-xl shadow border flex items-center gap-2">
                <Filter className="w-4 h-4"/>
                <select className="outline-none text-gray-700" 
                        value={filterType}
                        onChange={(e)=>setfilterType(e.target.value)}>
                            <option value="">Filter by Type</option>
                            <option value="">Bulk SMS</option>
                            <option value="">Group SMS</option>
                            <option value="">Single SMS</option>
                        </select>
            </div>

            <div className="ml-auto flex gap-3">
                 <button className="bg-blue-600 px-6 py-4 text-white rounded-xl shadow hover:bg-blue-800 flex items-center gap-2 ">
                    Load Balance
                </button>
                <button className="bg-blue-600 px-4 py-2 text-white rounded-xl shadow hover:bg-blue-800 flex items-center gap-2 ">
                    <Upload/>
                </button>

                <button className="bg-white border px-4 py-2 rounded-xl shadow hover:bg-gray-300">
                    <Filter/>
                </button>
            </div>
        </div>
        <div className="bg-gray-200 shadow-xl rounded-xl overflow-hidden border">
            <div className="overflow-x-auto">
                <table className="w-full text-md text-center">
                    <thead className="bg-gray-100 text-gray-700">
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
                        {data.map((row,index)=>(
                            <tr key={index}
                                className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3">{row.sn}</td>
                                    <td className="p-3">{row.date}</td>
                                    <td className="p-3">{row.particular}</td>
                                    <td className="p-3">{row.dr}</td>
                                    <td className="p-3">{row.cr}</td>
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
       </div>
    );
}
export default BalanceReportPage;