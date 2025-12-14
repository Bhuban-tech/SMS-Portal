"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, ENDPOINTS } from "@/config/api";


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, 
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      document.cookie = `token=${data.data.token}; path=/`;

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("adminId", data.data.id.toString());
      localStorage.setItem("username", data.data.username);
      localStorage.setItem("email", data.data.email || "");
      
  
      router.push("/dashboard");
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 border border-teal-100 hover:scale-105 transition-transform duration-500">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <span className="text-teal-600">SMS Portal</span>{" "}
          <span className="text-gray-700">Login</span>
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-bold mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 placeholder-gray-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 rounded-xl bg-teal-500 text-white font-semibold shadow-lg hover:bg-teal-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}