import React from 'react';

const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-gray-200 border-t-indigo-600`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {fullPage && (
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Loading Workspace...
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
