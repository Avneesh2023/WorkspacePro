import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

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
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
            Your secure session is active. All dashboard elements are locked behind JWT authentication.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">
              Session Profile
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">ACCOUNT ID</span>
                <span className="text-sm font-mono text-slate-300">{user?._id}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">FULL NAME</span>
                <span className="text-sm text-slate-300">{user?.name}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">EMAIL ADDRESS</span>
                <span className="text-sm text-slate-300">{user?.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">ROLE PROFILE</span>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* Secure Routing Status */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4">
                Authentication Status
              </h2>
              <div className="flex items-center gap-3 text-emerald-400 font-medium mb-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
                JWT Token Verified
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your browser successfully stored the token in local storage. Returning users are authenticated automatically on load.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800/60 text-xs text-slate-500">
              Token expires in 30 days.
            </div>
          </div>

          {/* Next Steps / Quick Actions */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4">
                Quick Workspace Actions
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Manage Clients & Leads
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Create New Client Project
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Track Board Tasks & Status
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                to="/clients"
                className="w-full text-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl font-semibold text-white shadow-lg shadow-indigo-600/10 text-sm block"
              >
                Clients Workspace
              </Link>
              <Link
                to="/projects"
                className="w-full text-center py-2.5 px-4 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl font-semibold text-slate-300 border border-slate-750 text-sm block"
              >
                Projects Workspace
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
