// src/components/LoadingSkeleton.jsx

export const LoadingSkeleton = () => {
    return (
      <div className="flex flex-col border rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="h-48 bg-gray-300"></div>
  
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  };
  