export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">156</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">142</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Inactive</p>
              <p className="text-2xl font-bold text-red-600">6</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              👥
            </div>
            <div>
              <p className="font-medium text-slate-800">Manage Users</p>
              <p className="text-sm text-slate-500">View and manage staff users</p>
            </div>
          </a>

          <a
            href="/settings/audit"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
              📝
            </div>
            <div>
              <p className="font-medium text-slate-800">Audit Trail</p>
              <p className="text-sm text-slate-500">View activity logs</p>
            </div>
          </a>

          <a
            href="/portal/articles"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
              📰
            </div>
            <div>
              <p className="font-medium text-slate-800">Articles</p>
              <p className="text-sm text-slate-500">Manage portal articles</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
