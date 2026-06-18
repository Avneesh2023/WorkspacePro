import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projectStatus, setProjectStatus] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, projectsData, tasksData, projectStatusData, taskStatusData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentProjects(),
          dashboardService.getRecentTasks(),
          dashboardService.getProjectStatusStats(),
          dashboardService.getTaskStatusStats()
        ]);
        setStats(statsData);
        setRecentProjects(projectsData);
        setRecentTasks(tasksData);
        setProjectStatus(projectStatusData);
        setTaskStatus(taskStatusData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Colors for project statuses
  const PROJECT_STATUS_COLORS = {
    'Planning': '#64748b',    // Slate
    'In Progress': '#3b82f6', // Blue
    'Review': '#f59e0b',      // Amber
    'Completed': '#10b981'    // Emerald
  };

  // Colors for task statuses
  const TASK_STATUS_COLORS = {
    'Todo': '#94a3b8',        // Light Slate
    'In Progress': '#6366f1', // Indigo
    'Completed': '#10b981'    // Emerald
  };

  const projectChartData = projectStatus
    ? Object.keys(projectStatus).map((key) => ({
        name: key,
        value: projectStatus[key],
        color: PROJECT_STATUS_COLORS[key] || '#6366f1'
      }))
    : [];

  const taskChartData = taskStatus
    ? Object.keys(taskStatus).map((key) => ({
        name: key,
        value: taskStatus[key],
        color: TASK_STATUS_COLORS[key] || '#6366f1'
      }))
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

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
          <LoadingSpinner fullPage={true} />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/15 flex flex-col items-center gap-4 text-center max-w-md mx-auto mt-12 shadow-xl animate-fadeIn">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-bold text-white mb-1">Unable to load dashboard</h4>
              <p className="text-slate-400 text-sm">Failed to retrieve dashboard metrics.</p>
            </div>
          </div>
        ) : stats.totalClients === 0 ? (
          <div className="max-w-xl mx-auto mt-12">
            <EmptyState
              title="Welcome to Antigravity Workspace"
              description="Start by adding your first client and creating projects to view analytics, track metrics, and manage tasks."
              actionText="Add Client"
              onAction={() => navigate('/clients')}
              iconType="clients"
            />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Clients Card */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clients</span>
                <span className="text-3xl font-extrabold text-white mt-2">{stats.totalClients}</span>
              </div>

              {/* Projects Card */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</span>
                <span className="text-3xl font-extrabold text-indigo-400 mt-2">{stats.totalProjects}</span>
              </div>

              {/* Tasks Card */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</span>
                <span className="text-3xl font-extrabold text-purple-400 mt-2">{stats.totalTasks}</span>
              </div>

              {/* Completed Tasks Card */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-2">{stats.completedTasks}</span>
              </div>

              {/* Pending Tasks Card */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</span>
                <span className="text-3xl font-extrabold text-amber-400 mt-2">{stats.pendingTasks}</span>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Project Status Distribution BarChart */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800">
                  Project Status Distribution
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectChartData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '12px',
                          color: '#f8fafc'
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {projectChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Completion Rate PieChart */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg flex flex-col">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800">
                  Task Status Distribution
                </h3>
                <div className="h-64 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {taskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '12px',
                          color: '#f8fafc'
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-8 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Projects Section */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800">Recent Projects</h3>
                  {recentProjects.length === 0 ? (
                    <p className="text-slate-500 text-sm font-medium">No projects found. Create your first project.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
                          <div>
                            <Link to={`/projects/${project._id}`} className="font-bold text-slate-200 hover:text-indigo-400 text-sm block transition-colors">
                              {project.title}
                            </Link>
                            <span className="text-xs text-slate-500 font-semibold mt-0.5 block">
                              Client: {project.clientId?.name || '—'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              project.status === 'Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-slate-550/10 text-slate-400 border border-slate-550/20'
                            }`}>
                              {project.status}
                            </span>
                            <span className="text-[10px] text-slate-550 block mt-1">
                              {new Date(project.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Tasks Section */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800">Recent Tasks</h3>
                  {recentTasks.length === 0 ? (
                    <p className="text-slate-500 text-sm font-medium">No tasks found. Create your first task.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentTasks.map((task) => (
                        <div key={task._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
                          <div>
                            <Link to="/tasks" className="font-bold text-slate-200 hover:text-indigo-400 text-sm block transition-colors">
                              {task.title}
                            </Link>
                            <span className="text-xs text-slate-500 font-semibold mt-0.5 block">
                              Project: {task.projectId?.title || '—'}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-slate-550/10 text-slate-450 border border-slate-550/20'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-550 block mt-1">
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '—'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
