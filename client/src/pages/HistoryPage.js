import React from 'react';
import { Loader2 } from 'lucide-react';

export const HistoryPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Loader2 size={32} className="animate-spin text-gray-300" />
      </div>
      <p>Coming Soon</p>
    </div>
  );
};

