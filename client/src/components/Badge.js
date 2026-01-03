import React from 'react';

export const Badge = ({ status }) => {
  const styles = {
    completed: "bg-green-50 text-green-700 border-green-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    uploading: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status] || styles.uploading}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

