import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledProjectId = searchParams.get('projectId') || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: prefilledProjectId,
    priority: 'Medium',
    status: 'Todo',
    dueDate: '',
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId) {
      setError('Please provide a title and assign a project.');
      toast.error('Please provide a title and assign a project.');
      return;
    }
    try {
      await taskService.createTask(formData);
      toast.success('Task created successfully!');
      // If we had a prefilled project, redirect back to that project's details page!
      if (prefilledProjectId) {
        navigate(`/projects/${prefilledProjectId}`);
      } else {
        navigate('/tasks');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create task.';
      setError(errMsg);
      toast.error(errMsg);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-lg w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white">Create Task</h1>
            <p className="text-slate-400 text-sm mt-1.5">Define deliverables, due dates, and priority settings.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold animate-shake">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Task Title */}
              <div>
                <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Task Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Build Login API"
                  className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm"
                />
              </div>

              {/* Project Dropdown */}
              <div>
                <label htmlFor="projectId" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Assign Project Workspace
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  required
                  value={formData.projectId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-semibold text-sm cursor-pointer"
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id} className="bg-slate-900">
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority & Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-semibold text-sm cursor-pointer"
                  >
                    <option value="Low" className="bg-slate-900">Low</option>
                    <option value="Medium" className="bg-slate-900">Medium</option>
                    <option value="High" className="bg-slate-900">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Task Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-semibold text-sm cursor-pointer"
                  >
                    <option value="Todo" className="bg-slate-900">Todo</option>
                    <option value="In Progress" className="bg-slate-900">In Progress</option>
                    <option value="Completed" className="bg-slate-900">Completed</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm cursor-pointer"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Task Scope / Details
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe task scope or verification criteria..."
                  className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm leading-relaxed"
                ></textarea>
              </div>

              {/* Buttons */}
              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-all rounded-xl font-bold text-white shadow-lg text-sm cursor-pointer mt-4"
              >
                Create Task
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTask;
