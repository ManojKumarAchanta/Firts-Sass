import React from 'react';
import { UploadCloud, ChevronRight, Settings, Image as ImageIcon, ArrowRight, X, Download, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { formatBytes } from '../utils/formatBytes';
import { geminiService } from '../services/apiService';

export const ImageToolsPage = () => {
  const {
    files,
    setFiles,
    processing,
    setProcessing,
    progress,
    setProgress,
    completed,
    setCompleted,
    aiRenaming,
    setAiRenaming
  } = useApp();

  const handleFileUpload = (e) => {
    const mockFiles = [
      { id: 1, name: 'screenshot_2024.png', size: 2400000, type: 'image/png' },
      { id: 2, name: 'vacation_photo.jpg', size: 4500000, type: 'image/jpeg' },
      { id: 3, name: 'design_mockup.webp', size: 1200000, type: 'image/webp' },
    ];
    setFiles(mockFiles);
  };

  const startConversion = () => {
    setProcessing(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProcessing(false);
        setCompleted(true);
      }
      setProgress(current);
    }, 200);
  };

  const handleSmartRename = async (fileId, currentName) => {
    setAiRenaming(fileId);
    const prompt = `Suggest a single, clean, SEO-friendly filename (with extension) for an image currently named "${currentName}". Return ONLY the filename, nothing else.`;

    const updateFileName = (newName) => {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName.trim() } : f));
      setAiRenaming(null);
    };

    try {
      const text = await geminiService.generateContent(prompt);
      if (text) updateFileName(text);
    } catch (e) {
      console.error(e);
      setAiRenaming(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Tools</span> <ChevronRight size={14} /> <span>Images</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Image Conversion</h2>
        <p className="text-gray-500 mt-1">Convert, compress, and resize images in bulk.</p>
      </div>

      {!files.length && !completed ? (
        <Card className="p-12 border-2 border-dashed border-gray-200 text-center hover:border-gray-400 transition-colors cursor-pointer" onClick={handleFileUpload}>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Images</h3>
          <p className="text-gray-500 text-sm mb-6">Support for PNG, JPG, WEBP, AVIF up to 50MB</p>
          <Button>Select Files</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Main List */}
           <div className="lg:col-span-2 space-y-4">
              {files.map((file, idx) => (
                <Card key={idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0 sm:w-48">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                     <button
                        onClick={() => handleSmartRename(file.id, file.name)}
                        className="text-xs flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 px-2 py-1 rounded transition-colors whitespace-nowrap"
                        disabled={aiRenaming === file.id}
                     >
                        {aiRenaming === file.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {aiRenaming === file.id ? 'Renaming...' : 'Rename'}
                     </button>
                    <div className="hidden sm:block text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">JPG</div>
                    <ArrowRight size={14} className="text-gray-400 hidden sm:block" />
                    <select className="bg-white border border-gray-200 text-xs rounded px-2 py-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none flex-1 sm:flex-none">
                      <option>WEBP</option>
                      <option>PNG</option>
                      <option>AVIF</option>
                    </select>
                    <button className="text-gray-400 hover:text-red-500" onClick={() => setFiles(files.filter((_, i) => i !== idx))}>
                      <X size={18} />
                    </button>
                  </div>
                </Card>
              ))}

              {files.length > 0 && !completed && (
                 <Button variant="ghost" className="w-full border-2 border-dashed border-gray-200 text-gray-400 hover:text-gray-600 py-6" onClick={handleFileUpload}>
                    + Add more files
                 </Button>
              )}
           </div>

           {/* Sidebar Controls */}
           <div className="space-y-4">
             <Card className="p-5 sticky top-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings size={16} /> Configuration
                </h4>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">Global Output Format</label>
                    <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none">
                      <option>WEBP (Recommended)</option>
                      <option>JPG</option>
                      <option>PNG</option>
                    </select>
                  </div>

                  <div>
                     <div className="flex justify-between mb-1.5">
                        <label className="text-xs font-medium text-gray-700 block">Quality</label>
                        <span className="text-xs text-gray-500">80%</span>
                     </div>
                    <input type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-500">Est. Reduction</span>
                    <span className="font-medium text-green-600">~65%</span>
                  </div>
                  {completed ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => { setCompleted(false); setFiles([]); }}>
                      <Download size={16} className="mr-2" /> Download All
                    </Button>
                  ) : (
                    <Button className="w-full" loading={processing} onClick={startConversion}>
                      {processing ? 'Processing...' : `Convert ${files.length} Files`}
                    </Button>
                  )}
                </div>
             </Card>
           </div>
        </div>
      )}
    </div>
  );
};

