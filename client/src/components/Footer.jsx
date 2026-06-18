import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/20 py-6 text-center text-xs text-slate-500 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>Antigravity Workspace &copy; {new Date().getFullYear()} &bull; Professional MERN Platform</p>
      </div>
    </footer>
  );
};

export default Footer;
