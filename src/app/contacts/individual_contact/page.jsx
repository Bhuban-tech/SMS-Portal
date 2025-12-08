"use client";

import React, { useState, useRef } from "react";
import { Plus, Upload, X, Trash, Edit, Send } from "lucide-react";
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
  const [newContact, setNewContact] = useState({ name: "", mobile: "", groups: "" });
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
    setNewContact({ name: "", mobile: "", groups: "" });
    setModalOpen(true);
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

  const handleSaveContact = () => {
    if (!newContact.name || !newContact.mobile) {
      alert("Please fill in Name and Mobile Number");
      return;
    }

    const groupsArray = newContact.groups.split(",").map((g) => g.trim()).filter(Boolean);

    if (editingContact !== null) {
      setContactsData((prev) =>
        prev.map((c) =>
          c.id === editingContact
            ? { ...c, name: newContact.name, mobile: newContact.mobile, groups: groupsArray }
            : c
        )
      );
    } else {
      const newId = contactsData.length ? contactsData[contactsData.length - 1].id + 1 : 1;
      setContactsData([...contactsData, { id: newId, name: newContact.name, mobile: newContact.mobile, groups: groupsArray }]);
    }

    setModalOpen(false);
    setEditingContact(null);
    setNewContact({ name: "", mobile: "", groups: "" });
  };

  const handleDeleteContact = (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
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
      complete: function (results) {
        const newContacts = results.data.map((row, index) => ({
          id: contactsData.length + index + 1,
          name: row.name,
          mobile: row.mobile,
          groups: row.groups ? row.groups.split(",").map((g) => g.trim()) : [],
        }));

        setContactsData((prev) => [...prev, ...newContacts]);
        alert(`${newContacts.length} contacts uploaded successfully!`);
      },
      error: function (err) {
        console.error(err);
        alert("Error parsing CSV file.");
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
     
      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header/>

  
        <main className="p-6 overflow-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-800">Individual Contacts</h1>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm cursor-pointer"
                >
                  <Plus size={16} /> Add Contact
                </button>
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" ref={fileInputRef} />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-2 py-2 transition text-sm cursor-pointer"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.N</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mobile Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Groups</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No contacts found.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 border-b">
                        <td className="px-6 py-4 text-sm">{contact.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{contact.name}</td>
                        <td className="px-6 py-4 text-sm">{contact.mobile}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.groups.join(", ")}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => openEditModal(contact)}
                            className="flex items-center gap-1 px-2 py-1 text-white rounded bg-blue-500 hover:bg-blue-600 transition cursor-pointer"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                          >
                            <Trash size={16} /> Delete
                          </button>
                          <button
                            onClick={() => handleSendSMS(contact)}
                            className="flex items-center gap-1 px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition cursor-pointer"
                          >
                            <Send size={15} /> Send SMS
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>


          {modalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setModalOpen(false)}
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">{editingContact !== null ? "Edit Contact" : "Add New Contact"}</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={newContact.mobile}
                    onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Groups (comma separated)"
                    value={newContact.groups}
                    onChange={(e) => setNewContact({ ...newContact, groups: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleSaveContact}
                    className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition cursor-pointer"
                  >
                    {editingContact !== null ? "Save Changes" : "Save Contact"}
                  </button>
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
