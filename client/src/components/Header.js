import React from 'react';
import { Sun, MoreHorizontal, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const { view, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile Header */}
      <header className="h-16 border-b border-gray-200 flex md:hidden items-center justify-between px-4 sticky top-0 bg-white z-30">
         <div className="font-bold flex items-center gap-2">
           <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center">
             <Zap size={14} fill="currentColor" />
           </div>
           ConvertHub.
         </div>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-100 rounded">
           <MoreHorizontal size={20} />
         </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex h-16 border-b border-gray-200 items-center justify-between px-8 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-2 text-sm text-gray-400">
           <span>Workspace</span> <span className="text-gray-300">/</span> <span className="text-gray-900 font-medium capitalize">{view.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-4">
           <button className="text-gray-500 hover:text-black transition-colors"><Sun size={18} /></button>
        </div>
      </header>
    </>
  );
};

