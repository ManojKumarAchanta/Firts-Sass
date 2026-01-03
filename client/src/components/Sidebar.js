import React from 'react';
import { X, Zap, FileImage, Files, FileText, LayoutGrid, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavButton } from './NavButton';

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, view, setView } = useApp();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 w-64 p-4 z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-white md:bg-gray-50`}>
        <div className="flex items-center justify-between mb-8 px-2 font-bold text-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center">
              <Zap size={14} fill="currentColor" />
            </div>
            ConvertHub.
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tools</p>
          <NavButton icon={FileImage} label="Image Tools" active={view === 'tool-image'} onClick={() => setView('tool-image')} />
          <NavButton icon={Files} label="PDF Tools" active={view === 'tool-pdf'} onClick={() => setView('tool-pdf')} />
          <NavButton icon={FileText} label="Document Tools" active={view === 'tool-doc'} onClick={() => setView('tool-doc')} />
        </div>

        <div className="mt-8 space-y-1">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Workspace</p>
          <NavButton icon={LayoutGrid} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={History} label="Job History" active={view === 'history'} onClick={() => setView('history')} />
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Free Plan</span>
              <span className="text-gray-500">5/10 used</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-black h-1.5 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <button className="text-xs text-blue-600 font-medium mt-2 hover:underline">Upgrade to Pro</button>
          </div>
        </div>
      </aside>
    </>
  );
};

