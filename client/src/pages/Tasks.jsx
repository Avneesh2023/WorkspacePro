import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import taskService from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const { logout } = useAuth();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      // Trigger delete API call
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
      setActionSuccess('Task deleted successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to delete task.');
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Trigger quick update in backend immediately
      const updated = await taskService.updateTask(id, { status: newStatus });
      // Update local state
      setTasks(tasks.map((t) => (t._id === id ? { ...t, status: updated.status } : t)));
      setActionSuccess('Task status updated.');
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (err) {
      alert('Failed to update task status.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                WorkspacePro
              </Link>
              <div className="hidden md:flex items-center gap-6 font-semibold text-sm text-slate-300">
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/clients" className="hover:text-white transition-colors">
                  Clients
                </Link>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
                <Link to="/tasks" className="text-indigo-400 transition-colors">
                  Tasks
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={logout}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Tasks</h1>
            <p className="text-slate-400 text-sm mt-1">Deliverables, execution tracking, and kanban-ready statuses.</p>
          </div>
          <Link
            to="/tasks/create"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl font-bold text-white shadow-lg text-sm"
          >
            Create Task
          </Link>
        </div>

        {actionSuccess && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold animate-in fade-in duration-200">
            {actionSuccess}
          </div>
        )}

        {loading ? (
          <div className="h-64 flex flex-col justify-center items-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 text-sm font-medium">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-semibold">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/10">
            <svg className="w-12 h-12 text-slate-650 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-bold text-slate-300">No tasks available.</h3>
            <p className="text-slate-500 text-sm mt-1">Create your first task.</p>
            <Link
              to="/tasks/create"
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-bold rounded-xl text-xs"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-850 shadow-lg bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
            <table className="min-w-full divide-y divide-slate-800/80">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-sm">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-200">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-350">
                      {task.projectId?.title || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="bg-slate-950 text-slate-300 text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3.5">
                        <Link
                          to={`/projects/${task.projectId?._id || ''}`}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          View Project
                        </Link>
                        <Link
                          to={`/tasks/edit/${task._id}`}
                          className="text-slate-400 hover:text-slate-300 font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
