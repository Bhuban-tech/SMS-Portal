"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Users, LogOut, User } from "lucide-react";

const Header = ({
  collegeName = "Aadim National College",
  balance = 5000,
  avatarIcon = <Users size={20} className="text-white" />,
  bgColor = "bg-white",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    router.push("/profile");
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    // 🔥 Remove auth data
    localStorage.removeItem("token");        // access token
    localStorage.removeItem("adminId");      // optional
    localStorage.removeItem("user");         // optional

    setDropdownOpen(false);

    // 🔁 Redirect to login
    router.replace("/login"); // replace prevents back navigation
  };

  return (
    <header
      className={`${bgColor} w-full rounded-xl shadow-md p-4 lg:p-5 flex flex-col lg:flex-row items-center justify-between`}
    >
      <div></div>

      <div className="flex items-center gap-4 mt-3 lg:mt-0 relative" ref={dropdownRef}>
        <div className="text-right">
          <p className="text-sm lg:text-base text-slate-600">{collegeName}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Rs. {balance.toLocaleString()}
          </p>
        </div>

        <div
          className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {avatarIcon}
        </div>

        {dropdownOpen && (
          <div className="absolute right-6 top-12 bg-white shadow-md rounded-md w-40 z-50">
            <ul>
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 cursor-pointer"
                onClick={handleProfileClick}
              >
                <User size={16} /> Edit Profile
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
