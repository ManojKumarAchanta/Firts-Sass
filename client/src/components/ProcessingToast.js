import React from 'react';
import { Loader2, Check, X, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './Button';

export const ProcessingToast = () => {
  const { processing, progress, completed, setCompleted, files, view } = useApp();

  if (processing) {
    return (
      <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-in slide-in-from-bottom-5">
         <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <Loader2 size={20} className="animate-spin" />
            </div>
            <div className="flex-1">
               <h4 className="text-sm font-semibold text-gray-900">Processing Files</h4>
               <p className="text-xs text-gray-500 mb-2">Compressing and converting...</p>
               <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (completed && !files.length && view !== 'tool-image') {
    return (
      <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-in slide-in-from-bottom-5">
         <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
               <Check size={20} />
            </div>
            <div className="flex-1">
               <h4 className="text-sm font-semibold text-gray-900">Download Ready</h4>
               <p className="text-xs text-gray-500 mb-2">Your files have been processed successfully.</p>
               <div className="flex gap-2">
                  <Button className="h-8 text-xs w-full" onClick={() => setCompleted(false)}>Download Zip</Button>
               </div>
            </div>
            <button onClick={() => setCompleted(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
         </div>
      </div>
    );
  }

  return null;
};

