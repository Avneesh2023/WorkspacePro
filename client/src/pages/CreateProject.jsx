import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import clientService from '../services/clientService';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Planning');
  const [deadline, setDeadline] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.getClients();
        setClients(data);
        if (data.length > 0) {
          setClientId(data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch clients for selector:', err);
        setError('Failed to fetch client list.');
      } finally {
        setFetchingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Project title is required.');
      return;
    }
    if (!clientId) {
      setError('Please assign a client to this project.');
      return;
    }

    setLoading(true);
    try {
      await projectService.createProject({
        title,
        description,
        status,
        deadline: deadline || undefined,
        clientId,
      });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-800 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-white">Create Project</h2>
          <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">
            Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Project Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm"
              placeholder="e.g. E-Commerce Website"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Assign Client *</label>
            {fetchingClients ? (
              <div className="text-xs text-slate-500">Loading clients...</div>
            ) : clients.length === 0 ? (
              <div className="text-xs text-amber-400">
                No clients found. Please{' '}
                <Link to="/clients/create" className="underline font-bold text-indigo-400">
                  create a client
                </Link>{' '}
                first.
              </div>
            ) : (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c._id} value={c._id} className="bg-slate-900">
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm cursor-pointer"
            >
              <option value="Planning" className="bg-slate-900">Planning</option>
              <option value="In Progress" className="bg-slate-900">In Progress</option>
              <option value="Review" className="bg-slate-900">Review</option>
              <option value="Completed" className="bg-slate-900">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Project Scope / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm resize-none"
              placeholder="Outline deliverables, features, and requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || fetchingClients || clients.length === 0}
            className="mt-6 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-650 transition-all rounded-xl font-bold text-white shadow-lg text-sm flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Create Project'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
