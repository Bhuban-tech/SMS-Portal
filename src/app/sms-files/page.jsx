"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Edit,
  Filter,
  Search,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

function SMSFilesPage() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFile, setNewFile] = useState({ fileName: "", fileType: "", size: "" });
  const [bulkGroupName, setBulkGroupName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const fileInputRef = useRef(null);

  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedAdminId = localStorage.getItem("adminId");
      setToken(storedToken || "");
      setAdminId(Number(storedAdminId) || 0);
    }
  }, []);

  const fetchFiles = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch groups");
      }

      const data = await res.json();
      const groups = Array.isArray(data) ? data : data.data || [];
      setFiles(groups);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err.message || "Failed to load groups");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const openEditModal = (file) => {
    setSelectedFile(file);
    setNewFile({
      fileName: file.fileName || "",
      fileType: file.fileType || "",
      size: file.size || "",
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedFile?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/update/${selectedFile.id}`, {
        method: "PUT",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFile),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update group");
      }

      const updatedGroup = await res.json();

      setFiles((prev) =>
        prev.map((f) => (f.id === selectedFile.id ? { ...f, ...updatedGroup } : f))
      );

      toast.success("Group details updated successfully!");
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update group");
      fetchFiles(); 
    }
  };

const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ["csv", "xlsx"];
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !allowedTypes.includes(extension)) {
    toast.warning("Only CSV or XLSX files are allowed");
    e.target.value = null;
    return;
  }

  if (!bulkGroupName.trim()) {
    toast.warning("Please enter a group name");
    e.target.value = null;
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const groupRequest = {
    name: bulkGroupName.trim(),
    senderId: adminId,
  };
   formData.append(
    "groupRequest",
    new Blob([JSON.stringify(groupRequest)], { type: "application/json" })
  );

  setUploading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/groups/contacts/bulk`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Upload failed");

    const newGroup = {
      id: result.id,
      fileName: result.fileName || file.name,
      fileType: result.fileType || extension,
      size: result.size || file.size,
      groupName: result.groupName || result.name || bulkGroupName.trim(),
      name: result.name || bulkGroupName.trim(),
      createdAt: result.createdAt || new Date().toISOString(),
      author: result.author || "admin college",
    };

    setFiles((prev) => [...prev, newGroup]);
    toast.success("File uploaded and contacts added successfully!");
    setBulkGroupName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchFiles();
  } catch (err) {
    console.error("Upload error:", err);
    toast.error(err.message || "Failed to upload file");
  } finally {
    setUploading(false);
  }
};


  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/delete/${fileToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete");
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      toast.success("Group deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete group");
      fetchFiles(); // fallback
    } finally {
      setDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  const filteredFiles = files.filter((f) =>
    (f.groupName || f.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.fileName || "").toLowerCase().includes(search.toLowerCase())
  );

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
                placeholder="Search group name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-xl py-2 pl-10 pr-4 shadow-sm text-sm"
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" />
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter group name"
                value={bulkGroupName}
                onChange={(e) => setBulkGroupName(e.target.value)}
                className="border rounded-xl py-2 px-3 text-sm shadow-sm"
                disabled={uploading}
              />
              <button
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow flex items-center gap-2 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                {uploading ? "Uploading..." : "ADD FILES"}
              </button>
              <button className="rounded-lg px-3 py-2 border shadow-sm hover:bg-gray-100">
                <Filter className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-xl p-4 overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="bg-teal-700 text-white">
                  <th className="p-3">S.N</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">File Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Group Name</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-10 text-center text-gray-500">
                      Loading groups...
                    </td>
                  </tr>
                ) : filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-10 text-center text-gray-500">
                      {files.length === 0
                        ? "No groups found. Upload your first file!"
                        : "No groups match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{row.author || "admin college"}</td>
                      <td className="p-3">{row.fileName || "-"}</td>
                      <td className="p-3 uppercase">{row.fileType || "-"}</td>
                      <td className="p-3">{row.size || "-"}</td>
                      <td className="p-3 font-medium">{row.groupName || row.name || "-"}</td>
                      <td className="p-3">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="p-3 flex gap-3 justify-center">
                        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(row)}
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* EDIT MODAL */}
          {editModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="absolute top-4 right-4"
                >
                  <X />
                </button>
                <h2 className="text-xl font-bold mb-4">Edit Group</h2>
                <label className="text-sm text-gray-600 block mb-1">File Name</label>
                <input
                  className="w-full border rounded p-2 mb-3"
                  value={newFile.fileName}
                  onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
                />
                <label className="text-sm text-gray-600 block mb-1">File Type</label>
                <input
                  className="w-full border rounded p-2 mb-3"
                  value={newFile.fileType}
                  onChange={(e) => setNewFile({ ...newFile, fileType: e.target.value })}
                />
                <label className="text-sm text-gray-600 block mb-1">Size</label>
                <input
                  className="w-full border rounded p-2 mb-4"
                  value={newFile.size}
                  onChange={(e) => setNewFile({ ...newFile, size: e.target.value })}
                />
                <button
                  onClick={handleSaveEdit}
                  className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* DELETE MODAL */}
          {deleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                <p className="mb-6">
                  Are you sure you want to delete the group "
                  <strong>{fileToDelete?.groupName || fileToDelete?.name}</strong>
                  "? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
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
