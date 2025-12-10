"use client";

import React, { useState } from "react";
import { Search, Plus, Eye, Edit, Trash, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function GroupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddContacts, setShowAddContacts] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const groups = [
    { id: 1, name: "BCA 2080 Batch", total: 12 },
    { id: 2, name: "CSIT 2079 Batch", total: 22 },
    { id: 3, name: "BBA 2078 Batch", total: 25 },
    { id: 4, name: "MBA 2077 Batch", total: 30 },
    { id: 5, name: "BBS 2076 Batch", total: 18 },
  ];

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Header title="Groups Contact" />
        </div>

        {/* <div className="bg-gray-100 p-4 ">
      <h2 className="text-xl font-semibold text-gray-800 text-center">Groups Contact</h2>
    </div> */}
    
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
         
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm w-full shadow focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

          
            <button
              onClick={() => setShowAddGroup(true)}
              className="px-4 sm:px-5 py-2 bg-teal-600 text-white font-medium hover:bg-teal-700 rounded-xl shadow flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Group
            </button>
          </div>

        
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-4">
            <table className="w-full text-sm text-center min-w-[500px] md:min-w-full">
              <thead className="bg-teal-700 text-white text-sm font-semibold">
                <tr>
                  <th className="px-6 py-4">S.N</th>
                  <th className="px-6 py-4">Group Name</th>
                  <th className="px-6 py-4">Total Contacts</th>
                  <th className="px-6 py-4">Actions</th>
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
                      className={`text-center ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } hover:bg-gray-200 transition`}
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">{g.name}</td>
                      <td className="px-6 py-4">{g.total}</td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                         
                          <button
                            onClick={() => {
                              setSelectedGroup(g);
                              setShowAddContacts(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                         
                          <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>

                        
                          <button
                            onClick={() => {
                              setSelectedGroup(g);
                              setShowEditGroup(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                        
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

      {/* Modals */}
      {showAddGroup && (
        <Modal title="Add New Group" close={() => setShowAddGroup(false)}>
          <input
            type="text"
            placeholder="Group Name"
            className="w-full border p-2 rounded-lg"
          />
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg w-full mt-4 cursor-pointer">
            Save Group
          </button>
        </Modal>
      )}

      {showEditGroup && (
        <Modal title="Edit Group" close={() => setShowEditGroup(false)}>
          <input
            type="text"
            defaultValue={selectedGroup?.name}
            className="w-full border p-2 rounded-lg"
          />
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full mt-4 cursor-pointer">
            Update Group
          </button>
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal title="Confirm Delete" close={() => setShowDeleteConfirm(false)}>
          <p className="text-gray-700 text-center">
            Are you sure you want to delete <strong>{selectedGroup?.name}</strong>?
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-4 cursor-pointer">
            Delete
          </button>
        </Modal>
      )}

      {showAddContacts && (
        <Modal
          title={`Add Contacts to ${selectedGroup?.name}`}
          close={() => setShowAddContacts(false)}
        >
          <textarea
            placeholder="Enter contacts (comma or line separated)"
            className="w-full border p-3 rounded-lg h-32"
          ></textarea>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mt-4 cursor-pointer">
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
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        {children}
      </div>
    </div>
  );
}
