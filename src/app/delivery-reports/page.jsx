"use client";

import React, { useState } from "react";

const SAMPLE_REPORTS = [
  {
    id: 1,
    phone: "9800000001",
    message: "Hello from Sparrow SMS!",
    status: "DELIVERED",
    timestamp: "2025-01-10 10:30 AM",
  },
  {
    id: 2,
    phone: "9800000002",
    message: "Your OTP is 12345",
    status: "FAILED",
    timestamp: "2025-01-10 10:35 AM",
  },
  {
    id: 3,
    phone: "9800000003",
    message: "Reminder: Meeting at 2 PM",
    status: "DELIVERED",
    timestamp: "2025-01-10 11:00 AM",
  },
];

export default function Page() {
  const [reports] = useState(SAMPLE_REPORTS);

  return (
    <div className="p-6 min-h-screen bg-(--bg-main)">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Delivery Reports
      </h1>

      {/* Card Container */}
      <div className="overflow-x-auto card-neumorph p-5 rounded-2xl bg-(--bg-card)">
        <table className="min-w-full text-left border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-(--vibrant-blue) text-white">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold tracking-wide">
                Phone
              </th>
              <th className="px-4 py-3 text-sm font-semibold tracking-wide">
                Message
              </th>
              <th className="px-4 py-3 text-sm font-semibold tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold tracking-wide">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr
                key={r.id}
                className="bg-(--bg-card) hover:bg-slate-100 transition-all border-b border-gray-200"
              >
                <td className="px-4 py-3">{r.phone}</td>
                <td className="px-4 py-3">{r.message}</td>

                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      r.status === "DELIVERED"
                        ? "text-(--success)"
                        : "text-red-500"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="px-4 py-3">{r.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
