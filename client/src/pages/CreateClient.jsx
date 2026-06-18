import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clientService from '../services/clientService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

const CreateClient = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Name and email are required.');
      toast.error('Name and email are required.');
      return;
    }

    setLoading(true);
    try {
      await clientService.createClient({ name, email, phone, company, notes });
      toast.success('Client created successfully!');
      navigate('/clients');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create client.';
      setError(errMsg);
      toast.error(errMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 text-white flex flex-col relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-white animate-fade-in">New Client</h2>
            <Link to="/clients" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider">
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
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Client Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm"
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Client Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm"
                placeholder="e.g. contact@acme.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm"
                placeholder="e.g. +1 555-0199"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm"
                placeholder="e.g. Acme Industries"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full bg-slate-955 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none transition-all text-sm resize-none"
                placeholder="Additional client details..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all rounded-xl font-bold text-white shadow-lg text-sm flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Add Client'
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateClient;
