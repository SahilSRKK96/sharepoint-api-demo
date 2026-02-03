'use client';

import { useState, useEffect } from 'react';
import { User, ApiResponse } from '@/types';
import UserModal from '@/components/UserModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/users`);
      const data: ApiResponse<User[]> = await response.json();

      if (data.success && data.data) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    const url = modalMode === 'add'
      ? `${API_BASE}/api/users`
      : `${API_BASE}/api/users/${selectedUser?.id}`;

    const method = modalMode === 'add' ? 'POST' : 'PATCH';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to save user');
    }

    await fetchUsers();
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchUsers();
        closeDeleteModal();
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !filterGroup || user.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  // Get unique groups for filter
  const uniqueGroups = [...new Set(users.map((u) => u.group).filter(Boolean))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Inactive':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      'Malaysian Airport Academy': 'bg-blue-100 text-blue-700',
      'Signalling & Telecommunications': 'bg-purple-100 text-purple-700',
      'Cargo Services': 'bg-orange-100 text-orange-700',
      'Operations': 'bg-cyan-100 text-cyan-700',
      'Permanent Way': 'bg-pink-100 text-pink-700',
    };
    return colors[group] || 'bg-slate-100 text-slate-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage User</h1>
          <p className="text-sm text-slate-500 mt-1">
            Home / Setting / Manage User
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Group Filter */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">Group</label>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Please Select --</option>
                  {uniqueGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">&nbsp;</label>
                <div className="flex gap-2">
                  <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => { setSearchTerm(''); setFilterGroup(''); }}
                    className="px-4 py-2 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Add User Button */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">&nbsp;</label>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <span>+</span> Add User
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800 text-white text-sm">
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">User ID</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Group</th>
                <th className="px-4 py-3 text-left font-medium">Updated Date</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                      {user.userId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${getGroupColor(
                          user.group
                        )}`}
                      >
                        {user.group || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(user.updatedDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200 text-sm text-slate-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name || ''}
        loading={deleteLoading}
      />
    </div>
  );
}
