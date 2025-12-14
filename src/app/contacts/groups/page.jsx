"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, Edit, Trash } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { toast } from "sonner";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export default function GroupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [addingGroup, setAddingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [addingContact, setAddingContact] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState([]); // ✅ multiple
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [showViewContactsModal, setShowViewContactsModal] = useState(false);
  const [groupContacts, setGroupContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    loadGroups();
  }, [token]);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // ---------------------------
  // Load all groups
  // ---------------------------
  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_GROUPS, {
        headers: getHeaders(),
      });
      const result = await res.json();
      if (result.success) setGroups(result.data);
      else toast.error(result.message || "Failed to fetch groups");
    } catch {
      toast.error("Error loading groups");
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openGroupModal = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setNewGroupName(group.name);
    } else {
      setEditingGroup(null);
      setNewGroupName("");
    }
    setShowGroupModal(true);
  };

  // ---------------------------
  // Add or Edit Group
  // ---------------------------
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return toast.error("Please enter group name");

    setAddingGroup(true);
    try {
      let res, result;

      if (editingGroup) {
        res = await fetch(
          `${API_BASE_URL}${ENDPOINTS.UPDATE_GROUP(editingGroup.id)}`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ name: newGroupName }),
          }
        );
        result = await res.json();
        if (!result.success)
          return toast.error(result.message || "Failed to update group");

        setGroups((prev) =>
          prev.map((g) =>
            g.id === editingGroup.id ? { ...g, name: newGroupName } : g
          )
        );
        toast.success("Group updated successfully!");
      } else {
        res = await fetch(API_BASE_URL + ENDPOINTS.CREATE_GROUP, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ name: newGroupName }),
        });
        result = await res.json();
        if (!result.success)
          return toast.error(result.message || "Failed to create group");

        setGroups((prev) => [...prev, result.data]);
        toast.success("Group added successfully!");
      }

      setNewGroupName("");
      setEditingGroup(null);
      setShowGroupModal(false);
    } catch {
      toast.error("Error saving group");
    } finally {
      setAddingGroup(false);
    }
  };

  // ---------------------------
  // Delete Group
  // ---------------------------
  const openDeleteModal = (group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}${ENDPOINTS.DELETE_GROUP(groupToDelete.id)}`,
        { method: "DELETE", headers: getHeaders() }
      );
      const result = await res.json();
      if (!result.success)
        return toast.error(result.message || "Failed to delete group");

      setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id));
      toast.success("Group deleted successfully!");
    } catch {
      toast.error("Error deleting group");
    } finally {
      setShowDeleteModal(false);
      setGroupToDelete(null);
    }
  };

  // ---------------------------
  // View Group Contacts
  // ---------------------------
  const handleViewGroupContacts = async (group) => {
    setContactsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}${ENDPOINTS.GET_GROUP_CONTACTS(group.id)}`,
        {
          headers: getHeaders(),
        }
      );
      const result = await res.json();
      if (!result.success) return toast.error("Failed to load group contacts");

      setGroupContacts(result.data.contacts);
      setSelectedGroup(group);
      setShowViewContactsModal(true);
    } catch {
      toast.error("Error loading group contacts");
    } finally {
      setContactsLoading(false);
    }
  };

  // ---------------------------
  // Add Contact Modal
  // ---------------------------
  const openAddContactModal = async (group) => {
    setSelectedGroup(group);
    setSelectedContactIds([]); // reset selection
    setAddingContact(false);

    try {
      const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_CONTACTS, {
        headers: getHeaders(),
      });
      const result = await res.json();
      if (!result.success) return toast.error("Failed to load contacts");

      setAllContacts(result.data);
      setShowAddContactModal(true);
    } catch {
      toast.error("Error loading contacts");
    }
  };

  const handleAddSelectedContact = async () => {
    if (selectedContactIds.length === 0)
      return toast.error("Please select at least one contact");

    setAddingContact(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}${ENDPOINTS.CONTACTS_ADD_TO_GROUP(selectedGroup.id)}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ contactIds: selectedContactIds }),
        }
      );
      const result = await res.json();
      if (!result.success)
        return toast.error(result.message || "Failed to add contacts");

  
      setGroups((prevGroups) =>
      prevGroups.map((g) =>
        g.id === selectedGroup.id ? result.data : g
      )
    );

      setSelectedContactIds([]);
      setShowAddContactModal(false);
      toast.success("Contacts added successfully!");
    } catch {
      toast.error("Error adding contacts");
    } finally {
      setAddingContact(false);
    }
  };

  const handleCheckboxToggle = (contactId) => {
    setSelectedContactIds((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  // ---------------------------
  // Render JSX
  // ---------------------------
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
          <GroupHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openGroupModal={openGroupModal}
          />
          <GroupTable
            groups={filteredGroups}
            openGroupModal={openGroupModal}
            openDeleteModal={openDeleteModal}
            openAddContactModal={openAddContactModal}
            handleViewGroupContacts={handleViewGroupContacts}
          />
        </main>
      </div>

      {/* Modals */}
      {showGroupModal && (
        <Modal
          title={editingGroup ? "Edit Group" : "Add New Group"}
          close={() => setShowGroupModal(false)}
        >
          <input
            type="text"
            placeholder="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleAddGroup}
            disabled={addingGroup}
            className={`w-full mt-4 py-2 text-white rounded-xl shadow ${
              addingGroup
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {addingGroup ? "Saving..." : editingGroup ? "Save Changes" : "Add Group"}
          </button>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal title="Delete Group?" close={() => setShowDeleteModal(false)}>
          <p className="text-center mb-4">
            Are you sure you want to delete <strong>{groupToDelete?.name}</strong>?
          </p>
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {showAddContactModal && (
        <Modal
          title={`Add Contact to ${selectedGroup?.name}`}
          close={() => setShowAddContactModal(false)}
        >
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {allContacts.map((c) => (
              <li
                key={c.id}
                className="p-2 border rounded-lg flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-gray-500 text-sm">{c.phoneNo}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedContactIds.includes(c.id)}
                  onChange={() => handleCheckboxToggle(c.id)}
                  className="w-5 h-5 text-teal-600"
                />
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddSelectedContact}
            disabled={addingContact}
            className={`w-full mt-4 py-2 text-white rounded-xl shadow ${
              addingContact
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {addingContact ? "Adding..." : "Add Contacts"}
          </button>
        </Modal>
      )}

      {showViewContactsModal && (
        <Modal
          title={`Contacts in ${selectedGroup?.name}`}
          close={() => setShowViewContactsModal(false)}
        >
          {contactsLoading ? (
            <p className="text-center py-4 text-gray-500">Loading...</p>
          ) : groupContacts.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No contacts in this group</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {groupContacts.map((c) => (
                <li
                  key={c.id}
                  className="p-2 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-gray-500 text-sm">{c.phoneNo}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}

// ---------------------------
// Reusable Modal Component
// ---------------------------
function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
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

// ---------------------------
// Group Header Component
// ---------------------------
function GroupHeader({ searchTerm, setSearchTerm, openGroupModal }) {
  return (
    <div className="flex justify-between items-center">
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 pr-10 text-sm w-full shadow"
        />
        <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      <button
        onClick={() => openGroupModal()}
        className="px-5 py-2 bg-teal-600 text-white rounded-xl shadow flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Group
      </button>
    </div>
  );
}

// ---------------------------
// Group Table Component
// ---------------------------
function GroupTable({ groups, openGroupModal, openDeleteModal, openAddContactModal, handleViewGroupContacts }) {
  return (
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
          {groups.map((g, index) => (
            <tr key={g.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{index + 1}</td>
              <td
                className="p-3 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleViewGroupContacts(g)}
              >
                {g.name}
              </td>
              <td className="p-3">{g.contactCount ?? 0}</td>
              <td className="p-3 flex justify-center gap-3">
                <button className="bg-emerald-600 text-white p-2 rounded-full shadow" onClick={() => openGroupModal(g)}>
                  <Edit className="w-4 h-4" />
                </button>
                <button className="bg-red-400 text-white p-2 rounded-full shadow" onClick={() => openDeleteModal(g)}>
                  <Trash className="w-4 h-4" />
                </button>
                <button className="bg-teal-600 text-white p-2 rounded-full shadow" onClick={() => openAddContactModal(g)}>
                  <Plus className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
