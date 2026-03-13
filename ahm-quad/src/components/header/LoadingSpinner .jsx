import React from 'react';

const LoadingSpinner = ({ size = 'xl', color = 'blue' }) => {
  // Map size prop to actual dimensions
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Map color prop to Tailwind colors
  const colorMap = {
    blue: 'border-blue-500',
    red: 'border-red-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeMap[size] || sizeMap.md}
          animate-spin
          rounded-full
          border-2
          border-t-transparent
          ${colorMap[color] || colorMap.blue}
        `}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Example usage with different sizes and colors
const LoadingExample = ({size="lg"}) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4 items-center">
        <LoadingSpinner size={size} />
        
      </div>
    </div>
  );
};

export default LoadingExample;