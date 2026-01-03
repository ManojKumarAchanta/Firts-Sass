import React from 'react';
import { ChevronRight, Files, Lock, FileText, Maximize2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { PDF_PAGES } from '../utils/constants';

export const PdfToolsPage = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="max-w-5xl mx-auto h-auto md:h-[calc(100vh-140px)] flex flex-col">
       <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Tools</span> <ChevronRight size={14} /> <span>PDF</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PDF Toolkit</h2>
            <p className="text-gray-500 mt-1">Manage your PDF documents securely.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-[600px] md:h-auto">
         {/* Toolbar */}
         <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-gray-50 justify-between flex-shrink-0 overflow-x-auto">
            <div className="flex gap-1 bg-gray-200/50 p-1 rounded-lg flex-shrink-0">
               {['merge', 'reorder', 'unlock', 'compress'].map(tab => (
                 <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
            <div className="flex gap-2 ml-4">
               <Button variant="secondary" className="h-8 text-xs">Reset</Button>
               <Button className="h-8 text-xs">Save PDF</Button>
            </div>
         </div>

         {/* Canvas */}
         <div className="flex-1 bg-gray-100/50 p-8 overflow-y-auto">
            {activeTab === 'reorder' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {PDF_PAGES.map((page) => (
                   <div key={page} className="group relative aspect-[1/1.4] bg-white shadow-sm hover:shadow-lg transition-all rounded cursor-move border border-gray-200 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-100 select-none">{page}</span>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                         <button className="p-1 bg-gray-900 text-white rounded hover:bg-black"><Maximize2 size={12} /></button>
                         <button className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"><Trash2 size={12} /></button>
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-400">Page {page}</div>
                   </div>
                 ))}
                 <div className="aspect-[1/1.4] border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                    <span className="text-2xl">+</span>
                    <span className="text-xs font-medium mt-1">Add Page</span>
                 </div>
              </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                     {activeTab === 'merge' && <Files size={32} />}
                     {activeTab === 'unlock' && <Lock size={32} />}
                     {activeTab === 'compress' && <FileText size={32} />}
                  </div>
                  <p className="text-gray-500 font-medium">Drag PDF files here to {activeTab}</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

