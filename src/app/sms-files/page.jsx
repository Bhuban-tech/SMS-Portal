"use client";

import React, { useState, useRef } from "react";
import { Download, Edit, Filter, Search, Trash2, X, Plus, Upload } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

function SMSFilesPage() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");

  const [files, setFiles] = useState([
    { sn: 1, author: "Aadim National College", fileName: "SEE-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 2, author: "Aadim National College", fileName: "SEE-Student", fileType: "XLSX", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
    { sn: 3, author: "Aadim National College", fileName: "12-Student", fileType: "csv", size: "50.03 KB", createdAt: "2025/07/24 - 7:50:55 pm" },
  ]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFile, setNewFile] = useState({ author: "", fileName: "", fileType: "", size: "" });
  const fileInputRef = useRef(null);

 
  const openEditModal = (file) => {
    setSelectedFile(file);
    setNewFile({ ...file });
    setEditModalOpen(true);
  };


  const handleSaveEdit = () => {
    setFiles((prev) =>
      prev.map((f) => (f.sn === selectedFile.sn ? { ...newFile, sn: selectedFile.sn, createdAt: f.createdAt } : f))
    );
    setEditModalOpen(false);
    setSelectedFile(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFileObj = {
      sn: files.length + 1,
      author: "Aadim National College",
      fileName: file.name.split(".")[0],
      fileType: file.name.split(".")[1] || "unknown",
      size: `${(file.size / 1024).toFixed(2)} KB`,
      createdAt: new Date().toLocaleString(),
    };

    setFiles((prev) => [...prev, newFileObj]);
    setUploadModalOpen(false);
  };

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

        <main className="flex-1 overflow-auto p-6">

          <div className="flex justify-between items-center mb-6">
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

            <div className="flex gap-3">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-5 py-2 bg-teal-500 text-white font-semibold hover:bg-teal-600 cursor-pointer rounded-lg shadow flex items-center gap-2"
              >
                <Plus size={16} /> ADD FILES
              </button>

              <button className="rounded-lg px-3 py-2 border shadow-sm hover:bg-gray-100">
                <Filter className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-xl p-4 overflow-x-auto">
            <table className="w-full text-sm rounded-xl overflow-hidden text-center">
              <thead>
                <tr className="bg-teal-700 text-white">
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
                {files
                  .filter((row) =>
                    row.fileName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((row, index) => (
                    <tr key={row.sn} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                      <td className="p-3">{row.sn}</td>
                      <td className="p-3">{row.author}</td>
                      <td className="p-3">{row.fileName}</td>
                      <td className="p-3">{row.fileType}</td>
                      <td className="p-3">{row.size}</td>
                      <td className="p-3">{row.createdAt}</td>

                      <td className="p-3 flex gap-3 justify-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow">
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(row)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow"
                        >
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

        
          {uploadModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">Upload File</h2>

                <div className="flex flex-col gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="border rounded p-2"
                  />

                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-teal-600"
                  >
                    <Upload size={16} /> Choose File
                  </button>
                </div>
              </div>
            </div>
          )}

          
          {editModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">Edit File</h2>

                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="File Name"
                    value={newFile.fileName}
                    onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
                    className="w-full border rounded p-2"
                  />

                  <input
                    type="text"
                    placeholder="File Type"
                    value={newFile.fileType}
                    onChange={(e) => setNewFile({ ...newFile, fileType: e.target.value })}
                    className="w-full border rounded p-2"
                  />

                  <input
                    type="text"
                    placeholder="Size"
                    value={newFile.size}
                    onChange={(e) => setNewFile({ ...newFile, size: e.target.value })}
                    className="w-full border rounded p-2"
                  />

                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default SMSFilesPage;
