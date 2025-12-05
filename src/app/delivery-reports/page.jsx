"use client";

import React, { useState, useEffect } from 'react';

const DELIVERY_STATUS_OPTIONS = ['ALL', 'DELIVERED', 'FAILED'];

const SAMPLE_REPORTS = [
  {
    id: 1,
    phone: '9800000001',
    message: 'Hello from Sparrow SMS!',
    status: 'DELIVERED',
    timestamp: '2025-01-10 10:30 AM',
  },
  {
    id: 2,
    phone: '9800000002',
    message: 'Your OTP is 12345',
    status: 'FAILED',
    timestamp: '2025-01-10 10:35 AM',
  },
];

export default function Page() {
  const [reports, setReports] = useState(SAMPLE_REPORTS);
  const [filter, setFilter] = useState('ALL');

  const filteredReports =
    filter === 'ALL'
      ? reports
      : reports.filter((r) => r.status === filter);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4 text-black">Delivery Reports</h1>

      <select
        className="bg-slate-800 p-2 rounded mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {DELIVERY_STATUS_OPTIONS.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <div className="space-y-3">
        {filteredReports.map((r) => (
          <div
            key={r.id}
            className="p-4 bg-slate-900 rounded-lg border border-slate-700"
          >
            <p><strong>Phone:</strong> {r.phone}</p>
            <p><strong>Message:</strong> {r.message}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={
                  r.status === 'DELIVERED'
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {r.status}
              </span>
            </p>
            <p><strong>Time:</strong> {r.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
