'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiSettings, FiFileText, FiBarChart3, FiLogOut, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-orange-600 text-white w-10 h-10 flex items-center justify-center text-lg font-bold">
              A
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage VideoHub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === 'overview'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiBarChart3 className="w-5 h-5" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === 'users'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiUsers className="w-5 h-5" />
                  User Management
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === 'content'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiFileText className="w-5 h-5" />
                  Content Management
                </button>
                <button
                  onClick={() => setActiveTab('website')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === 'website'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiEdit className="w-5 h-5" />
                  Website Editor
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                    activeTab === 'settings'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiSettings className="w-5 h-5" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Total Users</p>
                          <p className="text-3xl font-bold">1,234</p>
                        </div>
                        <FiUsers className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Total Videos</p>
                          <p className="text-3xl font-bold">5,678</p>
                        </div>
                        <FiFileText className="w-8 h-8 text-green-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Active Sessions</p>
                          <p className="text-3xl font-bold">89</p>
                        </div>
                        <FiBarChart3 className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">New user registered: john@example.com</p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">2 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Video playlist imported</p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">5 min ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Admin login detected</p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">10 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                      <FiPlus className="w-4 h-4" />
                      Add User
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Role</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">J</div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">John Doe</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">john@example.com</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs">User</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs">Active</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-gray-400 hover:text-blue-500 transition">
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-500 transition">
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">S</div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">Sarah Wilson</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">sarah@example.com</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs">User</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs">Inactive</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-gray-400 hover:text-blue-500 transition">
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-500 transition">
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Content Management</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Video Library</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Manage videos, playlists, and folders</p>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Import Videos</button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Manage Folders</button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notes & Annotations</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Review and moderate user notes</p>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">View All Notes</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'website' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Website Editor</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Hero Section</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                          <input
                            type="text"
                            defaultValue="Create your own study playlist like YouTube"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                          <textarea
                            rows={3}
                            defaultValue="Import playlists, take notes, track your progress, and keep your learning flow organized."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Save Changes</button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['All', 'Productivity', 'Learning', 'Design', 'AI', 'Development'].map((category) => (
                          <span key={category} className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                            {category}
                          </span>
                        ))}
                      </div>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Edit Categories</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">System Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Database Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Database Type</span>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm">Supabase</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Connection Status</span>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm">Connected</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Password</label>
                          <input
                            type="password"
                            defaultValue="admin"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Update Password</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}