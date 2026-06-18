import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import clientService from '../services/clientService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Planning');
  const [deadline, setDeadline] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientData = await clientService.getClients();
        setClients(clientData);

        const project = await projectService.getProject(id);
        setTitle(project.title);
        setDescription(project.description || '');
        setStatus(project.status || 'Planning');
        setClientId(project.clientId?._id || project.clientId || '');
        
        if (project.deadline) {
          const date = new Date(project.deadline);
          const formattedDate = date.toISOString().split('T')[0];
          setDeadline(formattedDate);
        }
      } catch (err) {
        setError('Failed to load project details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Project title is required.');
      toast.error('Project title is required.');
      return;
    }
    if (!clientId) {
      setError('Please assign a client to this project.');
      toast.error('Please assign a client to this project.');
      return;
    }

    setSaving(true);
    try {
      await projectService.updateProject(id, {
        title,
        description,
        status,
        deadline: deadline || null,
        clientId,
      });
      toast.success('Project updated successfully!');
      navigate('/projects');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update project.';
      setError(errMsg);
      toast.error(errMsg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 text-white flex flex-col relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        {loading ? (
          <LoadingSpinner fullPage={true} />
        ) : (
          <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-white">Edit Project</h2>
              <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">
                Cancel
              </Link>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold animate-shake">
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
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Assign Client *</label>
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
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all rounded-xl font-bold text-white shadow-lg text-sm flex items-center justify-center cursor-pointer"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditProject;
