"use client";

import React, { useState } from "react";
import { Search, Plus, Eye, Edit, Trash, X, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function GroupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddContacts, setShowAddContacts] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const groups = [
    { id: 1, name: "BCA 2080 Batch", total: 12 },
    { id: 2, name: "BCA 2079 Batch", total: 22 },
    { id: 3, name: "BCA 2078 Batch", total: 25 },
    { id: 4, name: "BCA 2077 Batch", total: 30 },
    { id: 5, name: "BCA 2076 Batch", total: 18 },
  ];

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
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

        <main className="flex-1 overflow-auto p-6 space-y-6">

          {/* TOP BAR */}
          <div className="flex justify-between items-center">
            {/* SEARCH */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm w-full shadow focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* ADD GROUP BUTTON */}
            <button
              onClick={() => setShowAddGroup(true)}
              className="px-5 py-2 bg-teal-600 text-white font-medium hover:bg-teal-700 rounded-xl shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Group
            </button>
          </div>

          {/* GROUP TABLE */}
          <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="p-3">S.N</th>
                  <th className="p-3">Group Name</th>
                  <th className="p-3">Total Contacts</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-gray-500">
                      No groups found.
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((g, index) => (
                    <tr
                      key={g.id}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{g.name}</td>
                      <td className="p-3">{g.total}</td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-3">

                          {/* ADD CONTACTS */}
                          <button
                            onClick={() => {
                              setSelectedGroup(g);
                              setShowAddContacts(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          {/* VIEW */}
                          <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow">
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setSelectedGroup(g);
                              setShowEditGroup(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => {
                              setSelectedGroup(g);
                              setShowDeleteConfirm(true);
                            }}
                            className="bg-red-400 hover:bg-red-600 text-white p-2 rounded-full shadow"
                          >
                            <Trash className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* --------------- ADD GROUP MODAL --------------- */}
      {showAddGroup && (
        <Modal title="Add New Group" close={() => setShowAddGroup(false)}>
          <input
            type="text"
            placeholder="Group Name"
            className="w-full border p-2 rounded-lg"
          />
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg w-full mt-4">
            Save Group
          </button>
        </Modal>
      )}

      {/* --------------- EDIT GROUP MODAL --------------- */}
      {showEditGroup && (
        <Modal title="Edit Group" close={() => setShowEditGroup(false)}>
          <input
            type="text"
            defaultValue={selectedGroup?.name}
            className="w-full border p-2 rounded-lg"
          />
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full mt-4">
            Update Group
          </button>
        </Modal>
      )}

      {/* --------------- DELETE CONFIRMATION MODAL --------------- */}
      {showDeleteConfirm && (
        <Modal title="Confirm Delete" close={() => setShowDeleteConfirm(false)}>
          <p className="text-gray-700 text-center">
            Are you sure you want to delete <strong>{selectedGroup?.name}</strong>?
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-4">
            Delete
          </button>
        </Modal>
      )}

      {/* --------------- ADD CONTACTS MODAL --------------- */}
      {showAddContacts && (
        <Modal
          title={`Add Contacts to ${selectedGroup?.name}`}
          close={() => setShowAddContacts(false)}
        >
          <textarea
            placeholder="Enter contacts (comma or line separated)"
            className="w-full border p-3 rounded-lg h-32"
          ></textarea>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-4">
            Add Contacts
          </button>
        </Modal>
      )}

    </div>
  );
}


function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        {children}
      </div>
    </div>
  );
}
