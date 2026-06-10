import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4">
          WorkspacePro
        </h1>
        <p className="text-slate-400 mb-6 font-medium">
          MERN application scaffolded with database connection and user authentication backend.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl font-semibold text-white shadow-lg shadow-indigo-600/30"
          >
            Go to Login
          </Link>
          <Link
            to="/register"
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 transition-colors rounded-xl font-semibold text-white border border-slate-600"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6">Login to WorkspacePro</h2>
        <p className="text-slate-400 text-center mb-6">Authentication forms will be fully integrated next.</p>
        <Link to="/" className="block text-center text-indigo-400 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}

function RegisterPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6">Register Account</h2>
        <p className="text-slate-400 text-center mb-6">Registration forms will be fully integrated next.</p>
        <Link to="/" className="block text-center text-indigo-400 hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPlaceholder />} />
        <Route path="/register" element={<RegisterPlaceholder />} />
      </Routes>
    </Router>
  );
}

export default App;
