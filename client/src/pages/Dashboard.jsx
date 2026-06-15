import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      {/* Navigation bar */}
      <nav className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                WorkspacePro
              </span>
              <div className="hidden md:flex items-center gap-6 ml-8 font-semibold text-sm text-slate-350">
                <Link to="/dashboard" className="text-indigo-400">Dashboard</Link>
                <Link to="/clients" className="hover:text-white transition-colors">Clients</Link>
                <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
                <Link to="/tasks" className="hover:text-white transition-colors">Tasks</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
                <span className="text-xs text-slate-400">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800/80 transition-all focus:outline-none flex items-center gap-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main dashboard content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/10 border border-indigo-500/10 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-400 font-medium">
            Here is a summary of your workspace operations and metrics.
          </p>
        </div>

        {loading ? (
          <div className="text-slate-400">Loading dashboard stats...</div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Clients Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clients</span>
              <span className="text-3xl font-extrabold text-white mt-2">{stats.totalClients}</span>
            </div>

            {/* Projects Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</span>
              <span className="text-3xl font-extrabold text-indigo-400 mt-2">{stats.totalProjects}</span>
            </div>

            {/* Tasks Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</span>
              <span className="text-3xl font-extrabold text-purple-400 mt-2">{stats.totalTasks}</span>
            </div>

            {/* Completed Tasks Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
              <span className="text-3xl font-extrabold text-emerald-400 mt-2">{stats.completedTasks}</span>
            </div>

            {/* Pending Tasks Card */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</span>
              <span className="text-3xl font-extrabold text-amber-400 mt-2">{stats.pendingTasks}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
