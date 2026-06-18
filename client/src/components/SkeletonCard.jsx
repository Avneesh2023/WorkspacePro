import React from 'react';

const SkeletonCard = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {/* Header row */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-3 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
          {/* Body description */}
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full rounded bg-gray-200"></div>
            <div className="h-3 w-5/6 rounded bg-gray-200"></div>
          </div>
          {/* Footer controls */}
          <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-50">
            <div className="h-4 w-20 rounded bg-gray-200"></div>
            <div className="h-6 w-16 rounded-full bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
