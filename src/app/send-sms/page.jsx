"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Send, X, Check, AlertCircle, Users, User, Upload } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function SMSSendUI() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("send-sms");

  const [formData, setFormData] = useState({ recipient: "", message: "", sendType: "individual" });
  const [selectedGroup, setSelectedGroup] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhone, setCurrentPhone] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [alert, setAlert] = useState(null);
  const [sending, setSending] = useState(false);

  const groups = [
    { id: 1, name: "Marketing Team", count: 25 },
    { id: 2, name: "Sales Team", count: 15 },
    { id: 3, name: "Premium Customers", count: 150 },
  ];

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,}$/;
    return phoneRegex.test(phone);
  };

  const addPhoneNumber = () => {
    const trimmed = currentPhone.trim();
    if (!trimmed) return showAlert("error", "Please enter a phone number");
    if (!validatePhone(trimmed)) return showAlert("error", "Invalid phone number format");
    if (phoneNumbers.includes(trimmed)) return showAlert("warning", "Phone number already added");

    setPhoneNumbers([...phoneNumbers, trimmed]);
    setCurrentPhone("");
    showAlert("success", "Phone number added successfully");
  };

  const removePhoneNumber = (phone) => {
    setPhoneNumbers(phoneNumbers.filter((p) => p !== phone));
  };

  const handleFileChange = (e) => {
    setBulkFile(e.target.files[0]);
    setSelectedFile(e.target.files[0]?.name || "");
  };

  const handleSendSMS = async () => {
    if (!formData.message.trim()) return showAlert("error", "Please enter a message");
    if (formData.sendType === "individual" && phoneNumbers.length === 0)
      return showAlert("error", "Please add at least one phone number");
    if (formData.sendType === "group" && !selectedGroup)
      return showAlert("error", "Please select a group");
    if (formData.sendType === "bulk" && !bulkFile)
      return showAlert("error", "Please select a file to send bulk SMS");

    setSending(true);

    try {
      let response;

      if (formData.sendType === "individual") {
        response = await fetch(`${API_BASE_URL}/sms/send/individual`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumbers, message: formData.message }),
        });
      } else if (formData.sendType === "group") {
        response = await fetch(`${API_BASE_URL}/sms/send/group`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: selectedGroup, message: formData.message }),
        });
      } else if (formData.sendType === "bulk") {
        const form = new FormData();
        form.append("file", bulkFile);
        form.append("message", formData.message);

        const token = localStorage.getItem("token");

        response = await fetch(`${API_BASE_URL}/sms/send/bulk`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send SMS");

      showAlert("success", "SMS sent successfully!");

      setFormData({ recipient: "", message: "", sendType: "individual" });
      setPhoneNumbers([]);
      setSelectedGroup("");
      setBulkFile(null);
      setSelectedFile("");
    } catch (err) {
      showAlert("error", err.message);
    } finally {
      setSending(false);
    }
  };

  const characterCount = formData.message.length;
  const messageCount = Math.ceil(characterCount / 160) || 1;

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
          <Header title="Send SMS" />
        </div>

     
        <main className="flex-1 overflow-auto p-4 md:p-6">

         
          {alert && (
            <div
              className={`mb-6 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
                alert.type === "success"
                  ? "bg-green-100 border-l-4 border-green-500 text-green-800"
                  : alert.type === "error"
                  ? "bg-red-100 border-l-4 border-red-500 text-red-800"
                  : "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800"
              }`}
            >
              {alert.type === "success" && <Check className="w-6 h-6" />}
              {(alert.type === "error" || alert.type === "warning") && (
                <AlertCircle className="w-6 h-6" />
              )}

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
              <p className="mt-2 text-blue-100">
                Send messages to individuals, groups, or via bulk upload
              </p>
            </div>

            <div className="p-8">
              
            
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Send Type
                </label>

                <div className="grid grid-cols-3 gap-4">

                 
                  <button
                    onClick={() =>
                      setFormData({ ...formData, sendType: "individual" })
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.sendType === "individual"
                        ? "border-teal-600 bg-blue-50 text-teal-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold">Individual</div>
                  </button>

               
                  <button
                    onClick={() =>
                      setFormData({ ...formData, sendType: "group" })
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.sendType === "group"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold">Group</div>
                  </button>

               
                  <button
                    onClick={() =>
                      setFormData({ ...formData, sendType: "bulk" })
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.sendType === "bulk"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold">Bulk</div>
                  </button>
                </div>
              </div>

          
              {formData.sendType === "individual" && (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={currentPhone}
                      onChange={(e) => setCurrentPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      className="border p-2 flex-1 rounded"
                    />
                    <button
                      onClick={addPhoneNumber}
                      className="bg-teal-600 text-white px-4 py-2 rounded"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-3 space-y-1">
                    {phoneNumbers.map((p) => (
                      <div
                        key={p}
                        className="flex justify-between bg-gray-100 p-2 rounded"
                      >
                        <span>{p}</span>
                        <button
                          onClick={() => removePhoneNumber(p)}
                          className="text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            
              {formData.sendType === "group" && (
                <div className="mb-6">
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="border p-2 w-full rounded"
                  >
                    <option value="">Select Group</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bulk Upload */}
              {formData.sendType === "bulk" && (
                <div className="mb-6">
                  <input type="file" onChange={handleFileChange} />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected File: {selectedFile}
                    </p>
                  )}
                </div>
              )}

             
              <div className="mb-6">
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Type your message"
                  className="border p-2 w-full rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {characterCount} characters / {messageCount} SMS
                </p>
              </div>

             
              <button
                onClick={handleSendSMS}
                disabled={sending}
                className="bg-teal-600 text-white px-6 py-3 rounded w-full"
              >
                {sending ? "Sending..." : "Send SMS"}
              </button>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
