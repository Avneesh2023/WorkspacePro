import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await taskService.updateTask(id, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === id ? { ...t, status: updated.status } : t)));
      toast.success(`Task status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update task status');
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

      <Navbar />

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

        {loading ? (
          <LoadingSpinner fullPage={true} />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-semibold">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="Create your first task to assign priorities, set deadlines, and track status progress."
            actionText="Create First Task"
            onAction={() => navigate('/tasks/create')}
            iconType="tasks"
          />
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
                      {task.projectId?.title ? (
                        <Link to={`/projects/${task.projectId._id}`} className="hover:text-indigo-400 transition-colors">
                          {task.projectId.title}
                        </Link>
                      ) : '—'}
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
                        className="bg-slate-950 text-slate-350 text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
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

      <Footer />
    </div>
  );
};

export default Tasks;
