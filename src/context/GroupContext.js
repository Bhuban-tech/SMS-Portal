"use client";

import React, { createContext, useState, useEffect } from "react";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";

export const GroupsContext = createContext();

export const GroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
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

  const fetchGroups = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_GROUPS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setGroups(data.data || []);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  const fetchContacts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ALL_CONTACTS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setContacts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
      fetchContacts();
    }
  }, [token]);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        setGroups,
        fetchGroups,
        contacts,
        token,
        adminId,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};
