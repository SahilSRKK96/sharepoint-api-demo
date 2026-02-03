'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => Promise<void>;
  user?: User | null;
  mode: 'add' | 'edit';
}

const groups = [
  'Malaysian Airport Academy',
  'Signalling & Telecommunications',
  'Cargo Services',
  'Operations',
  'Permanent Way',
];

const statuses = ['Active', 'Inactive', 'Pending'];

export default function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    status: 'Active',
    group: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        userId: user.userId,
        name: user.name,
        status: user.status,
        group: user.group,
      });
    } else {
      setFormData({
        userId: '',
        name: '',
        status: 'Active',
        group: '',
      });
    }
    setError('');
  }, [user, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {mode === 'add' ? 'Add New User' : 'Edit User'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
                placeholder="e.g., 301023"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' | 'Pending' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Group
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : mode === 'add' ? 'Add User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
