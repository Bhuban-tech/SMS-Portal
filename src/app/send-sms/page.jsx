"use client";

import React, { useState, useEffect } from "react";
import { Send, X, Check, AlertCircle, Users, User, Upload } from "lucide-react";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export default function SMSSendUI() {
  const [formData, setFormData] = useState({ message: "", sendType: "individual" });
  const [selectedGroup, setSelectedGroup] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentPhone, setCurrentPhone] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [alert, setAlert] = useState(null);
  const [sending, setSending] = useState(false);
  const [groups, setGroups] = useState([]);
  const [token, setToken] = useState("");
  const [adminId, setAdminId] = useState(0);


  useEffect(() => {
  const savedAdminId = localStorage.getItem("adminId");
  if (savedAdminId) setAdminId(Number(savedAdminId)); 
}, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);



  useEffect(() => {
    if (!token) return;

    const fetchGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_GROUPS}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setGroups(data.data);
      } catch (err) {
        console.error("Failed to load groups", err);
        showAlert("error", "Failed to load groups");
      }
    };

    fetchGroups();
  }, [token]);


  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

 const validatePhone = (phone) => /^\+977\d{10}$/.test(phone);


 
  const addPhoneNumber = () => {
    const trimmed = currentPhone.trim();
    if (!trimmed) return showAlert("error", "Please enter a phone number");
    if (!validatePhone(trimmed)) return showAlert("error", "Invalid phone number format");
    if (phoneNumbers.includes(trimmed)) return showAlert("warning", "Phone number already added");

    setPhoneNumbers([...phoneNumbers, trimmed]);
    setCurrentPhone("");
    showAlert("success", "Phone number added successfully");
  };

  const removePhoneNumber = (phone) => setPhoneNumbers(phoneNumbers.filter((p) => p !== phone));

 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

  
    if (!file.name.endsWith(".csv")) {
      showAlert("error", "Please upload a CSV file");
      e.target.value = null;
      return;
    }

    setBulkFile(file);
    setSelectedFile(file.name);
  };

  const handleSendSMS = async () => {
    if (!formData.message.trim()) return showAlert("error", "Please enter a message");

    if (formData.sendType === "individual" && phoneNumbers.length === 0)
      return showAlert("error", "Please add at least one phone number");

    if ((formData.sendType === "group" || formData.sendType === "bulk") && !selectedGroup)
      return showAlert("error", "Please select a group");

    if (formData.sendType === "bulk" && !bulkFile) return showAlert("error", "Please select a file");

    setSending(true);

    try {
      let response;
if (formData.sendType === "individual") {
  console.log("Sending individual SMS:", phoneNumbers, formData.message);

  const body = {
    senderId: adminId,
    content: formData.message,
    // recipientContactIds: [], 
    // recipientGroupIds: [],   
    recipientNumbers: phoneNumbers,
  };

  response = await fetch(`${API_BASE_URL}/api/messages/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}


 else if (formData.sendType === "group") {
    
        response = await fetch(`${API_BASE_URL}/sms/send/group`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ groupId: selectedGroup, message: formData.message }),
        });
      } else if (formData.sendType === "bulk") {
      
        const form = new FormData();
        form.append("file", bulkFile);
        form.append("message", formData.message);

        response = await fetch(`${API_BASE_URL}/api/groups/${selectedGroup}/contacts/bulk`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send SMS");

      showAlert("success", "SMS sent successfully!");

     
      if (formData.sendType === "individual") setPhoneNumbers([]);
      if (formData.sendType === "bulk") setBulkFile(null);
      setFormData({ ...formData, message: "" });
      setSelectedFile("");
    } catch (err) {
      showAlert("error", err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const characterCount = formData.message.length;
  const messageCount = Math.ceil(characterCount / 160) || 1;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
   
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
            {(alert.type === "error" || alert.type === "warning") && <AlertCircle className="w-6 h-6" />}
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
            <p className="mt-2 text-blue-100">Send messages to individuals, groups, or in bulk</p>
          </div>

          <div className="p-8">
          
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Send Type</label>
              <div className="grid grid-cols-3 gap-4">
                {["individual", "group", "bulk"].map((type) => {
                  const icons = { individual: User, group: Users, bulk: Upload };
                  const colors = { individual: "teal", group: "blue", bulk: "blue" };
                  const Icon = icons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, sendType: type })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.sendType === type
                          ? `border-${colors[type]}-600 bg-blue-50 text-${colors[type]}-700`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold capitalize">{type}</div>
                    </button>
                  );
                })}
              </div>
            </div>

         
            {formData.sendType === "individual" && (
              <div className="mb-6">
                <input
                  type="tel"
                  value={currentPhone}
                  onChange={(e) => setCurrentPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="border p-2 mr-2"
                />
                <button onClick={addPhoneNumber} className="bg-teal-600 text-white px-4 py-2 rounded ml-2">
                  Add
                </button>

                <div className="mt-2">
                  {phoneNumbers.map((p) => (
                    <div key={p}>
                      {p}{" "}
                      <button onClick={() => removePhoneNumber(p)} className="text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            {(formData.sendType === "group" || formData.sendType === "bulk") && (
              <div className="mb-6 relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Group</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-teal-500 hover:border-teal-500 transition"
                >
                  <option value="">-- Select a Group --</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.contactCount ?? 0} contacts)
                    </option>
                  ))}
                </select>
              </div>
            )}

          
            {formData.sendType === "bulk" && (
              <div className="mb-6">
                <input type="file" accept=".csv" onChange={handleFileChange} />
                {selectedFile && <p>Selected File: {selectedFile}</p>}
              </div>
            )}

        
            <div className="mb-6">
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message"
                className="border p-2 w-full"
              />
              <p>
                {characterCount} characters / {messageCount} SMS
              </p>
            </div>

            <button
              onClick={handleSendSMS}
              disabled={sending}
              className="bg-teal-600 text-white px-6 py-3 rounded disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send SMS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
