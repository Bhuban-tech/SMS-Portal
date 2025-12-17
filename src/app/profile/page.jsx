'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { API_BASE_URL, ENDPOINTS } from '@/config/api';

export default function Profile() {
  const router = useRouter();

  const [adminId, setAdminId] = useState(null);
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Load adminId
  useEffect(() => {
    const stored = localStorage.getItem('adminId');
    if (!stored) {
      router.push('/login');
    } else {
      setAdminId(stored);
    }
  }, [router]);

  // Fetch profile
  const fetchProfile = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_ADMIN(id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setUsername(data.data.username || '');
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setMessage('Could not load profile');
      setMessageType('error');
    }
  };

  useEffect(() => {
    if (adminId && token) fetchProfile(adminId);
  }, [adminId, token]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setMessage('');
    setLoading(true);

    if (!username.trim()) {
      setMessage('Username is required');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Validate password if changing
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setMessage('Current password is required to set a new one');
        setMessageType('error');
        setLoading(false);
        return;
      }
      if (newPassword.length < 8) {
        setMessage('New password must be at least 8 characters');
        setMessageType('error');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage('New passwords do not match');
        setMessageType('error');
        setLoading(false);
        return;
      }
    }

    const payload = { username: username.trim() };
    if (currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_ADMIN(adminId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        // empty response fallback
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.message || `Server error ${response.status}`);
      }

      setMessage(result.message || 'Profile updated successfully!');
      setMessageType('success');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      fetchProfile(adminId);
    } catch (err) {
      console.error('Update failed:', err);
      setMessage(err.message || 'Failed to update profile – check console');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 6000);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    if (adminId && token) fetchProfile(adminId);
  };

  if (!adminId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 bg-teal-600">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-200 transition"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg border ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <InputField
            label="Username"
            value={username}
            setValue={setUsername}
            Icon={User}
            placeholder="Enter username"
          />

          <PasswordInput
            label="Current Password (required only if changing password)"
            value={currentPassword}
            setValue={setCurrentPassword}
            show={showCurrentPassword}
            setShow={setShowCurrentPassword}
          />

          <PasswordInput
            label="New Password (optional)"
            value={newPassword}
            setValue={setNewPassword}
            show={showNewPassword}
            setShow={setShowNewPassword}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
          />

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Password input
function PasswordInput({ label, value, setValue, show, setShow }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="••••••••"
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

// Text input
function InputField({ label, value, setValue, Icon, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
        />
      </div>
    </div>
  );
}
