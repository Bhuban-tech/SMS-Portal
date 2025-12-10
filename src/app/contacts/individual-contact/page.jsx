"use client";

import React, { useState, useRef } from "react";
import { Plus, Upload, X, Trash, Edit, Send, Eye } from "lucide-react";
import Papa from "papaparse";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const contactsDataInitial = [
  { id: 1, name: "Bhuban", mobile: "9851579340", groups: ["BIT", "CSIT", "BCA"] },
  { id: 2, name: "Himal", mobile: "9851965462", groups: ["BIT", "CSIT"] },
  { id: 3, name: "Pemba Mainali", mobile: "9813629763", groups: ["BCA"] },
  { id: 4, name: "Himal Dhakal", mobile: "9761758529", groups: ["CSIT"] },
];

const ContactsPage = () => {
  const [contactsData, setContactsData] = useState(contactsDataInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewContact, setViewContact] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");

  const [newContact, setNewContact] = useState({
    name: "",
    mobile: "",
    groups: "",
  });

  const fileInputRef = useRef(null);

  const filteredContacts = contactsData.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.mobile.includes(term) ||
      c.groups.some((g) => g.toLowerCase().includes(term))
    );
  });

  const openAddModal = () => {
    setEditingContact(null);
    setModalOpen(true);
    setNewContact({ name: "", mobile: "", groups: "" });
  };

  const openEditModal = (contact) => {
    setEditingContact(contact.id);
    setNewContact({
      name: contact.name,
      mobile: contact.mobile,
      groups: contact.groups.join(", "),
    });
    setModalOpen(true);
  };

  const openViewModal = (contact) => {
    setViewContact(contact);
  };

  const handleSaveContact = () => {
    if (!newContact.name || !newContact.mobile) {
      alert("Please enter Name & Mobile Number");
      return;
    }

    const groupsArray = newContact.groups
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    if (editingContact !== null) {
      setContactsData((prev) =>
        prev.map((c) =>
          c.id === editingContact
            ? { ...c, name: newContact.name, mobile: newContact.mobile, groups: groupsArray }
            : c
        )
      );
    } else {
      const newId = contactsData.length
        ? contactsData[contactsData.length - 1].id + 1
        : 1;
      setContactsData([...contactsData, { id: newId, name: newContact.name, mobile: newContact.mobile, groups: groupsArray }]);
    }

    setModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (id) => {
    if (confirm("Delete this contact?")) {
      setContactsData((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSendSMS = (contact) => {
    alert(`Sending SMS to ${contact.name} (${contact.mobile})`);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newContacts = results.data.map((row, index) => ({
          id: contactsData.length + index + 1,
          name: row.name,
          mobile: row.mobile,
          groups: row.groups ? row.groups.split(",").map((g) => g.trim()) : [],
        }));

        setContactsData((prev) => [...prev, ...newContacts]);
        alert(`${newContacts.length} contacts uploaded successfully!`);
      },
      error: (err) => {
        console.error(err);
        alert("Error parsing CSV file.");
      },
    });
  };

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
          <Header title="Individual Contacts" />
        </div>

      {/* <div className="bg-gray-100 p-4 ">
      <h2 className="text-xl font-semibold text-slate-800 text-center">Individual Contact</h2>
    </div> */}
        <main className="flex-1 overflow-auto p-4 md:p-6 mt-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
         
            <div className="p-4 md:p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center ml-auto w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 shadow cursor-pointer"
                >
                  <Plus size={16} /> Add Contact
                </button>

                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleCSVUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 py-2 border rounded hover:bg-gray-100 shadow flex items-center gap-2 cursor-pointer"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>

        
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center min-w-[600px] md:min-w-full">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="p-3">S.N</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Groups</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-gray-500 text-center">
                        No contacts found.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact, idx) => (
                      <tr key={contact.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{contact.name}</td>
                        <td className="p-3">{contact.mobile}</td>
                        <td className="p-3 text-gray-600">{contact.groups.join(", ")}</td>

                        <td className="p-3 flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => openViewModal(contact)}
                            className="px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 shadow flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => openEditModal(contact)}
                            className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow flex items-center gap-1 cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow flex items-center gap-1 cursor-pointer"
                          >
                            <Trash size={16} />
                          </button>

                          <button
                            onClick={() => handleSendSMS(contact)}
                            className="px-2 py-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 shadow flex items-center gap-1 cursor-pointer"
                          >
                            <Send size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Edit Modal */}
          {modalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer" 
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">
                  {editingContact !== null ? "Edit Contact" : "Add New Contact"}
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  />

                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={newContact.mobile}
                    onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  />

                  <input
                    type="text"
                    placeholder="Groups (comma separated)"
                    value={newContact.groups}
                    onChange={(e) => setNewContact({ ...newContact, groups: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  />

                  <button
                    onClick={handleSaveContact}
                    className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 cursor-pointer"
                  >
                    {editingContact !== null ? "Save Changes" : "Save Contact"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Modal */}
          {viewContact && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                <button
                  onClick={() => setViewContact(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">Contact Details</h2>

                <div className="space-y-2 text-left">
                  <p><strong>Name:</strong> {viewContact.name}</p>
                  <p><strong>Mobile:</strong> {viewContact.mobile}</p>
                  <p><strong>Groups:</strong> {viewContact.groups.join(", ")}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContactsPage;
