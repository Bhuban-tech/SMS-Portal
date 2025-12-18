"use client";

import React, { useState, useEffect } from "react";
import { Send, X, Check, AlertCircle, Users, User, Upload } from "lucide-react";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({ message: "", sendType: "individual" });
  const [selectedGroup, setSelectedGroup] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhone, setCurrentPhone] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [bulkGroupName, setBulkGroupName] = useState("");
  const [alert, setAlert] = useState(null);
  const [sending, setSending] = useState(false);
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);

  // Load token and adminId
  useEffect(() => {
    const savedAdminId = localStorage.getItem("adminId");
    const savedToken = localStorage.getItem("token");
    if (savedAdminId) setAdminId(Number(savedAdminId));
    if (savedToken) setToken(savedToken);
  }, []);

  // Fetch groups and contacts
  useEffect(() => {
    if (!token) return;

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_GROUPS}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setGroups(data.data);
      } catch {
        showAlert("error", "Failed to load groups");
      }
    };

    const fetchContacts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_CONTACTS}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setContacts(data.data);
      } catch {
        showAlert("error", "Failed to load contacts");
      }
    };

    fetchGroups();
    fetchContacts();
  }, [token]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const removePhoneNumber = (phone) => setPhoneNumbers(phoneNumbers.filter((p) => p !== phone));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      showAlert("error", "Please upload a CSV file only");
      e.target.value = null;
      return;
    }

    setBulkFile(file);
    setSelectedFile(file.name);
  };

  const handleSendSMS = async () => {
    
    if (formData.sendType !== "bulk" && !formData.message.trim())
      return showAlert("error", "Please enter a message");

    if (formData.sendType === "individual" && phoneNumbers.length === 0)
      return showAlert("error", "Please add at least one phone number");

    if (formData.sendType === "group" && !selectedGroup)
      return showAlert("error", "Please select a group");

    if (formData.sendType === "bulk" && !bulkFile)
      return showAlert("error", "Please select a CSV file");

    if (formData.sendType === "bulk" && !bulkGroupName.trim())
      return showAlert("error", "Please enter a group name");

    setSending(true);

    try {
      let response;

      // Individual
      if (formData.sendType === "individual") {
        const body = {
          senderId: adminId,
          content: formData.message,
          recipientNumbers: phoneNumbers,
        };

        response = await fetch(`${API_BASE_URL}/api/messages/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      } 
     
      else if (formData.sendType === "group") {
        const body = {
          senderId: adminId,
          groupId: selectedGroup,
          content: formData.message,
        };

        response = await fetch(`${API_BASE_URL}/api/messages/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      } 
      
      else if (formData.sendType === "bulk") {
        const form = new FormData();
        form.append("file", bulkFile);

        const groupRequest = {
          name: bulkGroupName.trim(),
          senderId: adminId,
        };

        form.append(
          "groupRequest",
          new Blob([JSON.stringify(groupRequest)], { type: "application/json" })
        );

        response = await fetch(`${API_BASE_URL}/api/groups/contacts/bulk`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });
      }

      if (!response) throw new Error("No response from server");

    
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) throw new Error(data.message || "Request failed");

      
      toast.success(
        formData.sendType === "bulk"
          ? "Bulk contacts uploaded and added to group successfully!"
          : "SMS sent successfully!"
      );

      // Reset form   setFormData({ ...formData, message: "" });
      setPhoneNumbers([]);
      setCurrentPhone("");
      setBulkFile(null);
      setSelectedFile("");
      setBulkGroupName("");
      setSelectedGroup("");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const characterCount = formData.message.length;
  const messageCount = Math.ceil(characterCount / 160) || 1;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      {/* Sidebar can be added if needed */}
      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto">
        {alert && (
          <div
            className={`mb-6 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              alert.type === "success"
                ? "bg-green-100 border-l-4 border-green-500 text-green-800"
                : "bg-red-100 border-l-4 border-red-500 text-red-800"
            }`}
          >
            {alert.type === "success" ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="flex-1 font-medium">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-teal-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Send className="w-8 h-8" />
              Send SMS Message
            </h1>
            <p className="mt-2 text-blue-100">Send messages to individuals, groups, or upload contacts in bulk</p>
          </div>

          <div className="p-8">
            {/* Send Type */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Send Type</label>
              <div className="grid grid-cols-3 gap-4">
                {["individual", "group", "bulk"].map((type) => {
                  const icons = { individual: User, group: Users, bulk: Upload };
                  const Icon = icons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, sendType: type })}
                      className={`p-5 rounded-lg border-2 transition-all flex flex-col items-center ${
                        formData.sendType === type
                          ? "border-teal-600 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-8 h-8 mb-2" />
                      <span className="font-semibold capitalize">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual */}
            {formData.sendType === "individual" && (
              <div className="mb-6 relative">
                <input
                  type="text"
                  value={currentPhone}
                  onChange={(e) => setCurrentPhone(e.target.value)}
                  placeholder="Search by name or phone number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {currentPhone && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {contacts
                      .filter((c) =>
                        c.name.toLowerCase().includes(currentPhone.toLowerCase()) || c.phoneNo.includes(currentPhone)
                      )
                      .map((c) => (
                        <li
                          key={c.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            if (!phoneNumbers.includes(c.phoneNo)) {
                              setPhoneNumbers([...phoneNumbers, c.phoneNo]);
                              setCurrentPhone("");
                              showAlert("success", `${c.name} added`);
                            }
                          }}
                        >
                          {c.name} <span className="text-gray-500">({c.phoneNo})</span>
                        </li>
                      ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {phoneNumbers.map((p) => (
                    <span key={p} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {p}
                      <X size={16} onClick={() => removePhoneNumber(p)} className="cursor-pointer hover:text-red-600" />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Group */}
            {formData.sendType === "group" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Group</label>
                <select
                  value={selectedGroup}
                  placeholder="Select a group"
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">--Choose a group-- </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.contactCount ?? 0} contacts)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Bulk */}
            {formData.sendType === "bulk" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CSV File</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-teal-500 transition"
                    onClick={() => document.getElementById("bulkFileInput").click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {selectedFile ? `Selected: ${selectedFile}` : "Click to upload or drag CSV file here"}
                    </p>
                    <input
                      id="bulkFileInput"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={bulkGroupName}
                    onChange={(e) => setBulkGroupName(e.target.value)}
                    placeholder="e.g., Customers 2025, VIP Members"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </>
            )}

            {/* Message */}
            {formData.sendType !== "bulk" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  rows="6"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 resize-none"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {characterCount} characters • {messageCount} SMS part{messageCount > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSendSMS}
              disabled={sending}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {sending ? "Processing..." : formData.sendType === "bulk" ? "Upload Contacts to Group" : "Send SMS Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
