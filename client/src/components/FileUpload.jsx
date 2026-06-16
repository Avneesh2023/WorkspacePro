import { useState, useRef } from 'react';
import fileService from '../services/fileService';

const FileUpload = ({ projectId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setIsError(true);
        setMessage('File size exceeds 5MB limit.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
      setIsError(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setIsError(true);
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage('');
    setIsError(false);

    try {
      await fileService.uploadFile(file, projectId, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });

      setMessage('File uploaded successfully!');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-lg mt-6">
      <h3 className="text-md font-bold text-white mb-4">Upload Project Asset</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/20 hover:bg-slate-950/40"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.docx"
          />
          <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm text-slate-400 font-medium">
            {file ? file.name : 'Click to select or drag file here'}
          </span>
          <span className="text-xs text-slate-600 mt-1">
            Accepts PDF, PNG, JPG, JPEG, DOCX (Max 5MB)
          </span>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {message && (
          <p className={`text-xs font-bold ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-lg shadow-indigo-600/10 transition-all focus:outline-none"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
