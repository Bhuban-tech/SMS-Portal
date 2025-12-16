"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Upload, X, Trash, Edit, Send, Eye } from "lucide-react";
import Papa from "papaparse";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";
import { toast } from "sonner";


const ContactsPage = () => {
  const [contactsData, setContactsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewContact, setViewContact] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [newContact, setNewContact] = useState({ name: "", mobile: "" });
  const fileInputRef = useRef(null);

 
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };


  const loadContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL + ENDPOINTS.GET_ALL_CONTACTS, {
        headers: getAuthHeaders(),
      });
      const result = await res.json();

      if (result.success) {
        const formatted = result.data.map((c) => ({
          id: c.id,
          name: c.name,
          mobile: c.phoneNo,
        }));
        setContactsData(formatted);
      } else {
        toast.error(result.message || "Failed to fetch contacts");
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      toast.error("Error fetching contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = contactsData.filter((c) => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.mobile.includes(term);
  });

 
  const openAddModal = () => {
    setEditingContact(null);
    setNewContact({ name: "", mobile: "" });
    setModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact.id);
    setNewContact({ name: contact.name, mobile: contact.mobile });
    setModalOpen(true);
  };

  const openViewModal = (contact) => {
    setViewContact(contact);
  };

 
  const handleSaveContact = async () => {
    if (!newContact.name || !newContact.mobile) {
      toast.error("Please enter Name & Mobile Number.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newContact.mobile)) {
      toast.error("Please enter a valid 10-digit Mobile Number.");
      return;
    }

    const payload = { name: newContact.name, phoneNo: newContact.mobile };

    try {
      let res;
      if (editingContact !== null) {
        res = await fetch(API_BASE_URL + ENDPOINTS.UPDATE_CONTACT(editingContact), {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_BASE_URL + ENDPOINTS.CREATE_CONTACT, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Operation failed");
        return;
      }

      toast.success(editingContact !== null ? "Contact updated!" : "Contact added!");

      // Refetch all contacts after add/update
      await loadContacts();

      setModalOpen(false);
      setEditingContact(null);
    } catch (err) {
      console.error("Error saving contact:", err);
      toast.error("Error saving contact");
    }
  };

  // Delete contact
  const handleDeleteContact = async (id) => {
    setShowDeleteConfirm(false);

    try {
      const res = await fetch(API_BASE_URL + ENDPOINTS.DELETE_CONTACT(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Delete failed");
        return;
      }

      toast.success("Contact deleted successfully!");
      await loadContacts(); // Refetch all contacts after deletion
    } catch (err) {
      console.error("Error deleting contact:", err);
      toast.error("Error deleting contact");
    }
  };

  // Send SMS simulation
  const handleSendSMS = (contact) => {
    toast.success(`SMS sent to ${contact.name} (${contact.mobile})`);
  };

  // CSV Upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const newContacts = results.data.map((row) => ({
            name: row.name,
            phoneNo: row.mobile,
          }));

          // Send CSV data to backend (optional, if API supports bulk create)
          for (let contact of newContacts) {
            await fetch(API_BASE_URL + ENDPOINTS.CREATE_CONTACT, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(contact),
            });
          }

          toast.success(`${newContacts.length} contacts uploaded successfully!`);
          await loadContacts();
        } catch (err) {
          console.error("Error uploading CSV contacts:", err);
          toast.error("Error uploading CSV");
        }
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        toast.error("Error parsing CSV");
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}                                                                                                                                                                 activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <Header />

        <main className="flex-1 mt-7 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 shadow"
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
                  className="px-3 py-2 border rounded hover:bg-gray-100 shadow flex items-center gap-2"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="p-3">S.N</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-gray-500 text-center">
                        Loading contacts...
                      </td>
                    </tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-gray-500 text-center">
                        No contacts found.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact, idx) => (
                      <tr key={contact.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{contact.name}</td>
                        <td className="p-3">{contact.mobile}</td>

                        <td className="p-3 flex justify-center gap-2">
                          <button
                            onClick={() => openViewModal(contact)}
                            className="px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 shadow flex items-center gap-1"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => openEditModal(contact)}
                            className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow flex items-center gap-1"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedContact(contact);
                              setShowDeleteConfirm(true);
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow flex items-center gap-1"
                          >
                            <Trash size={16} />
                          </button> 

                          <button
                            onClick={() => handleSendSMS(contact)}
                            className="px-2 py-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 shadow flex items-center gap-1"
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
  <Modal
    title={editingContact !== null ? "Edit Contact" : "Add New Contact"}
    close={() => setModalOpen(false)}
  >
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
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, ""); // allow only numbers
        setNewContact({ ...newContact, mobile: value });

        if (value.length < 10) {
          setMobileError("Mobile number must be 10 digits");
        } else if (value.length > 10) {
          setMobileError("Mobile number cannot exceed 10 digits");
        } else {
          setMobileError("");
        }
      }}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
    />
    {mobileError && <p className="text-red-500 text-sm mt-1">{mobileError}</p>}

    <button
      onClick={() => {
        if (mobileError) {
          toast.error("Please fix mobile number errors");
          return;
        }
        handleSaveContact();
      }}
      className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 mt-4"
    >
      {editingContact !== null ? "Save Changes" : "Save Contact"}
    </button>
  </Modal>
)}


          {/* View Modal */}
          {viewContact && (
            <Modal title="Contact Details" close={() => setViewContact(null)}>
              <p><strong>Name:</strong> {viewContact.name}</p>
              <p><strong>Mobile:</strong> {viewContact.mobile}</p>
            </Modal>
          )}

          {/* Delete Confirm */}
          {showDeleteConfirm && selectedContact && (
            <Modal title="Confirm Delete" close={() => setShowDeleteConfirm(false)}>
              <p className="text-center">
                Are you sure you want to delete <strong>{selectedContact.name}</strong>?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};

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
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

export default ContactsPage;
