import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
      setError('');
    } catch (err) {
      setError('Failed to load projects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
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
            <h1 className="text-3xl font-extrabold text-white">Projects</h1>
            <p className="text-slate-400 text-sm mt-1">Workspace scopes, delivery track, and client mappings.</p>
          </div>
          <Link
            to="/projects/create"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl font-bold text-white shadow-lg text-sm"
          >
            Create Project
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner fullPage={true} />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-semibold">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Create your first project workspace to map tasks, assign deadlines, and collaborate on documents."
            actionText="Create First Project"
            onAction={() => navigate('/projects/create')}
            iconType="projects"
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-850 shadow-lg bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
            <table className="min-w-full divide-y divide-slate-800/80">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-200">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-350">
                      {project.clientId?.name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        project.status === 'Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-550/20'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-3.5">
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          View
                        </Link>
                        <Link
                          to={`/projects/edit/${project._id}`}
                          className="text-slate-400 hover:text-slate-300 font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(project._id)}
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

export default Projects;
