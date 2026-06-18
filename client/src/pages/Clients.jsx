import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clientService from '../services/clientService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getClients();
      setClients(data);
      setError('');
    } catch (err) {
      setError('Failed to load clients.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientService.deleteClient(id);
      setClients(clients.filter((c) => c._id !== id));
      if (selectedClient?._id === id) setSelectedClient(null);
      toast.success('Client deleted successfully');
    } catch (err) {
      toast.error('Failed to delete client');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Clients</h1>
            <p className="text-slate-400 text-sm mt-1">Directory of your registered business accounts.</p>
          </div>
          <Link
            to="/clients/create"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl font-bold text-white shadow-lg text-sm flex items-center gap-2"
          >
            Add Client
          </Link>
        </div>

        {/* State Renderers */}
        {loading ? (
          <LoadingSpinner fullPage={true} />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm font-semibold">
            {error}
          </div>
        ) : clients.length === 0 ? (
          <EmptyState
            title="No clients found"
            description="Create your first client profile to begin linking projects, tracking tasks, and managing assets."
            actionText="Create First Client"
            onAction={() => navigate('/clients/create')}
            iconType="clients"
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-850 shadow-lg bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
            <table className="min-w-full divide-y divide-slate-800/80">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-200">
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-350">
                      {client.company || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {client.phone || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-3.5">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                        >
                          View
                        </button>
                        <Link
                          to={`/clients/edit/${client._id}`}
                          className="text-slate-400 hover:text-slate-300 font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(client._id)}
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

      {/* VIEW SINGLE CLIENT MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-extrabold text-white mb-4">Client Details</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase block">Name</span>
                <span className="text-slate-200 font-semibold">{selectedClient.name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-550 font-bold uppercase block">Company</span>
                <span className="text-slate-200 font-semibold">{selectedClient.company || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-550 font-bold uppercase block">Email</span>
                <span className="text-slate-200 font-semibold">{selectedClient.email}</span>
              </div>
              <div>
                <span className="text-xs text-slate-550 font-bold uppercase block">Phone</span>
                <span className="text-slate-200 font-semibold">{selectedClient.phone || '—'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-550 font-bold uppercase block">Notes</span>
                <span className="text-slate-200 font-semibold block bg-slate-950 p-2.5 rounded-xl border border-slate-850 mt-1 whitespace-pre-wrap">{selectedClient.notes || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Clients;
