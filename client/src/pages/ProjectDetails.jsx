import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import fileService from '../services/fileService';
import FileUpload from '../components/FileUpload';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await projectService.getProject(id);
        setProject(data);
      } catch (err) {
        setError('Failed to load project details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks(id);
        setTasks(data);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setTasksLoading(false);
      }
    };

    const fetchFiles = async () => {
      try {
        const data = await fileService.getProjectFiles(id);
        setFiles(data);
      } catch (err) {
        console.error('Failed to load files:', err);
      } finally {
        setFilesLoading(false);
      }
    };

    fetchDetails();
    fetchTasks();
    fetchFiles();
  }, [id]);

  const fetchFiles = async () => {
    try {
      const data = await fileService.getProjectFiles(id);
      setFiles(data);
    } catch (err) {
      console.error('Failed to reload files:', err);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }
    try {
      await fileService.deleteFile(fileId);
      fetchFiles();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete file.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-955 text-white flex justify-center items-center">
        <div className="text-slate-450">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-955 text-white flex flex-col justify-center items-center p-6">
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-semibold max-w-md w-full">
          {error || 'Project not found.'}
        </div>
        <Link to="/projects" className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-bold">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      {/* Nav */}
      <nav className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              WorkspacePro
            </Link>
            <Link to="/projects" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Back to Projects
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Breadcrumbs & Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Link to="/projects" className="hover:text-slate-350 transition-colors">Projects</Link>
              <span>/</span>
              <span className="text-slate-400">Project Details</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">{project.title}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Deadline:{' '}
              <span className="text-slate-200 font-semibold">
                {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No deadline set'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
              project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              project.status === 'Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {project.status}
            </span>
            <Link
              to={`/projects/edit/${project._id}`}
              className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
            >
              Edit Project
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Info Pane (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scope / Description */}
            <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-3">Project Scope</h3>
              <p className="text-slate-300 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {project.description || 'No description provided for this project workspace.'}
              </p>
            </div>

            {/* Task Integration Section */}
            <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Tasks & Deliverables</h3>
                <Link
                  to={`/tasks/create?projectId=${project._id}`}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg text-xs font-bold text-white shadow-md"
                >
                  Create Task
                </Link>
              </div>

              {tasksLoading ? (
                <div className="py-6 text-center text-slate-400 text-sm font-medium">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/10">
                  <svg className="w-10 h-10 text-slate-650 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h4 className="text-sm font-bold text-slate-350">No Tasks Assigned</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Create tasks to manage steps and completion rates for this project.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-850/80 bg-slate-950/20">
                  <table className="min-w-full divide-y divide-slate-800/80">
                    <thead className="bg-slate-900/40">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium text-xs text-slate-300">
                      {tasks.map((task) => (
                        <tr key={task._id} className="hover:bg-slate-900/20">
                          <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-200">{task.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-slate-500/10 text-slate-450 border border-slate-550/20'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Files & Assets Section */}
            <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-6">Files & Deliverables</h3>

              {filesLoading ? (
                <div className="py-6 text-center text-slate-400 text-sm font-medium">Loading files...</div>
              ) : files.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center bg-slate-900/10">
                  <svg className="w-10 h-10 text-slate-650 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h4 className="text-sm font-bold text-slate-350">No Files Uploaded</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Upload project requirements, contracts, design drafts or invoices.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => {
                    const isImage = file.fileType?.startsWith('image/');
                    return (
                      <div key={file._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail / File Icon Preview */}
                          {isImage ? (
                            <img 
                              src={file.fileUrl} 
                              alt={file.fileName} 
                              className="w-10 h-10 object-cover rounded-lg border border-slate-800 bg-slate-900"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-bold text-slate-200 block truncate max-w-xs md:max-w-md">
                              {file.fileName}
                            </span>
                            <span className="text-[10px] text-slate-550 font-semibold mt-0.5 block">
                              Uploaded: {new Date(file.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-900 transition-all focus:outline-none"
                          >
                            Open
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file._id)}
                            className="px-3 py-1.5 rounded-lg border border-red-900/30 hover:border-red-800/50 text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 transition-all focus:outline-none"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload component integration */}
              <FileUpload projectId={project._id} onUploadSuccess={fetchFiles} />
            </div>
          </div>

          {/* Client Details Sidebar (1/3 width) */}
          <div className="p-6 rounded-2xl border border-slate-850 bg-slate-900/20 backdrop-blur-md space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Client Info</h3>
            
            {project.clientId ? (
              <div className="space-y-3 font-medium">
                <div>
                  <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider">Client Name</span>
                  <span className="text-sm text-slate-200 font-semibold">{project.clientId.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider">Company</span>
                  <span className="text-sm text-slate-200 font-semibold">{project.clientId.company || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider">Email Address</span>
                  <span className="text-sm text-indigo-400 hover:underline">{project.clientId.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider">Phone Number</span>
                  <span className="text-sm text-slate-300">{project.clientId.phone || '—'}</span>
                </div>
                {project.clientId.notes && (
                  <div>
                    <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider">Client Notes</span>
                    <p className="text-xs text-slate-400 mt-1 bg-slate-950 p-2.5 rounded-lg border border-slate-850 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {project.clientId.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-medium">No client details found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
