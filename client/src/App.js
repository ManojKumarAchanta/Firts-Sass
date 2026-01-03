import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  FileText, 
  Files, 
  Zap, 
  Settings, 
  History, 
  ChevronRight, 
  X, 
  Check, 
  Download, 
  Moon, 
  Sun,
  MoreHorizontal,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Trash2,
  LayoutGrid,
  Sparkles,
  Wand2,
  Copy,
  RefreshCw,
  Menu
} from 'lucide-react';

// --- API Configuration ---
const apiKey = ""; // System provides this at runtime

// --- Gemini API Helper ---
const callGemini = async (prompt, setLoading, setResult) => {
  if (!apiKey) {
    alert("API Key is missing. This feature requires the Gemini API.");
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error('API Call Failed');
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) setResult(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    setResult("Sorry, I couldn't process that request right now.");
  } finally {
    setLoading(false);
  }
};

// --- Mock Data & Utilities ---
const MOCK_HISTORY = [
  { id: 1, name: 'marketing_deck_v2.pdf', type: 'PDF Compression', date: '2 mins ago', size: '2.4 MB → 0.8 MB', status: 'completed' },
  { id: 2, name: 'hero_banner.png', type: 'Image Convert', date: '1 hour ago', size: '4.1 MB → 1.2 MB', status: 'completed' },
  { id: 3, name: 'contract_signed.docx', type: 'Doc to PDF', date: '3 hours ago', size: '500 KB', status: 'failed' },
];

const PDF_PAGES = [1, 2, 3, 4, 5];

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', loading, ...props }) => {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed h-10";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 border border-transparent shadow-sm",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 bg-transparent",
    ai: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-transparent shadow-md hover:shadow-lg"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ status }) => {
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

// --- Main Application Component ---

export default function ConvertHubApp() {
  const [view, setView] = useState('landing'); // landing, dashboard, tool-image, tool-pdf, tool-doc
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);
  
  // App State
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('merge'); // for PDF tools
  
  // AI State
  const [aiRenaming, setAiRenaming] = useState(null); // ID of file being renamed
  const [docInput, setDocInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Reset state when switching views
  useEffect(() => {
    setFiles([]);
    setProcessing(false);
    setProgress(0);
    setCompleted(false);
    setDocInput('');
    setAiOutput('');
    setLandingMenuOpen(false);
    if (view !== 'landing') {
      setSidebarOpen(false); // Close sidebar on nav on mobile
    }
  }, [view]);

  // Simulate File Upload
  const handleFileUpload = (e) => {
    const mockFiles = [
      { id: 1, name: 'screenshot_2024.png', size: 2400000, type: 'image/png' },
      { id: 2, name: 'vacation_photo.jpg', size: 4500000, type: 'image/jpeg' },
      { id: 3, name: 'design_mockup.webp', size: 1200000, type: 'image/webp' },
    ];
    setFiles(mockFiles);
  };

  // Simulate Processing
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
  
  // Handle Smart Rename
  const handleSmartRename = async (fileId, currentName) => {
    setAiRenaming(fileId);
    const prompt = `Suggest a single, clean, SEO-friendly filename (with extension) for an image currently named "${currentName}". Return ONLY the filename, nothing else.`;
    
    // We create a temporary setter for the specific file name update
    const updateFileName = (newName) => {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName.trim() } : f));
      setAiRenaming(null);
    };

    try {
      if (!apiKey) {
         setTimeout(() => updateFileName(`optimized_${currentName}`), 1000);
         return;
      }
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) updateFileName(text);
    } catch (e) {
      console.error(e);
      setAiRenaming(null);
    }
  };

  // --- Views ---

  const LandingPage = () => (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      {/* Navbar */}
      <nav className="border-b border-gray-100 fixed w-full bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              <Zap size={16} fill="currentColor" />
            </div>
            ConvertHub.
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">Docs</a>
          </div>
          <div className="hidden md:flex gap-3">
            <Button onClick={() => setView('dashboard')}>Get Started</Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setLandingMenuOpen(!landingMenuOpen)}>
             {landingMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {landingMenuOpen && (
           <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 p-4 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-5">
              <a href="#" className="text-gray-600 font-medium py-2">Features</a>
              <a href="#" className="text-gray-600 font-medium py-2">Pricing</a>
              <a href="#" className="text-gray-600 font-medium py-2">Docs</a>
              <div className="h-px bg-gray-100 my-2"></div>
              <Button className="justify-center" onClick={() => setView('dashboard')}>Get Started</Button>
           </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          v2.0 Now Available
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">
          File conversion for <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">
            modern teams.
          </span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          High-performance image optimization, PDF manipulation, and document processing API. 
          Simple, secure, and developer-friendly.
        </p>
        
        {/* Interactive Hero Dropzone */}
        <div 
          onClick={() => setView('dashboard')}
          className="group max-w-xl mx-auto bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 hover:border-blue-500 hover:bg-blue-50/10 transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <UploadCloud className="text-gray-400 group-hover:text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Upload files to start</h3>
          <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {[
            { icon: FileImage, title: "Smart Image Optimization", desc: "Compress PNG, JPG, WebP and AVIF with zero visual quality loss." },
            { icon: Files, title: "PDF Toolkit", desc: "Merge, split, reorder, unlock, and compress PDFs securely in the browser." },
            { icon: Settings, title: "API First", desc: "Automate your workflows with our robust Node.js and Python SDKs." },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon size={20} className="text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
             <div className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-xs">CH</div>
             ConvertHub
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );

  const Sidebar = () => (
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

  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
        active 
          ? 'bg-white text-black shadow-sm border border-gray-200' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const DashboardHome = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to ConvertHub</h2>
          <p className="text-gray-500">Start converting your files instantly.</p>
        </div>
        <Button onClick={() => setView('tool-image')} className="hidden md:flex">
           <UploadCloud className="w-4 h-4 mr-2" /> New Conversion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileImage size={20} /></div>
              <span className="text-xs text-gray-400 font-medium">This Month</span>
           </div>
           <p className="text-3xl font-bold text-gray-900">124</p>
           <p className="text-sm text-gray-500">Images Processed</p>
        </Card>
        <Card className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Files size={20} /></div>
              <span className="text-xs text-gray-400 font-medium">This Month</span>
           </div>
           <p className="text-3xl font-bold text-gray-900">45</p>
           <p className="text-sm text-gray-500">PDFs Merged</p>
        </Card>
        <Card className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><History size={20} /></div>
              <span className="text-xs text-gray-400 font-medium">Saved</span>
           </div>
           <p className="text-3xl font-bold text-gray-900">1.2 GB</p>
           <p className="text-sm text-gray-500">Bandwidth Saved</p>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Jobs</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">File Name</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Type</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Result</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_HISTORY.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                       {job.name.endsWith('.pdf') ? <FileText size={16} className="text-red-500 flex-shrink-0" /> : <ImageIcon size={16} className="text-blue-500 flex-shrink-0" />}
                       <span className="truncate max-w-[150px] md:max-w-none">{job.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{job.type}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs hidden md:table-cell">{job.size}</td>
                    <td className="px-6 py-4"><Badge status={job.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  const ImageTools = () => (
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

  const PdfTools = () => (
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
  
  const SmartDocTools = () => {
    return (
      <div className="max-w-4xl mx-auto h-auto md:h-[calc(100vh-140px)] flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Tools</span> <ChevronRight size={14} /> <span>Document Assistant</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                 Gemini Document Assistant <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full">AI Powered</span>
              </h2>
              <p className="text-gray-500 mt-1">Paste your document text below to summarize, translate, or polish using Gemini.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 md:h-full md:min-h-0">
           {/* Input Column */}
           <div className="flex flex-col gap-4 h-[500px] md:h-full">
              <Card className="flex-1 flex flex-col overflow-hidden p-0 border-blue-200 shadow-md">
                 <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Input Text</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setDocInput('')}>Clear</Button>
                 </div>
                 <textarea 
                    className="flex-1 p-4 resize-none outline-none text-sm text-gray-700 leading-relaxed" 
                    placeholder="Paste your document content here (e.g., meeting notes, essay draft, email)..."
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                 />
              </Card>
              
              <div className="grid grid-cols-2 gap-2">
                 <Button 
                    variant="ai" 
                    onClick={() => callGemini(`Summarize the following text in 3 concise bullet points:\n\n${docInput}`, setAiLoading, setAiOutput)}
                    disabled={!docInput || aiLoading}
                    loading={aiLoading}
                 >
                    <Sparkles size={16} className="mr-2" /> Summarize
                 </Button>
                 <Button 
                    variant="secondary"
                    onClick={() => callGemini(`Fix grammar and polish the tone of this text to be professional:\n\n${docInput}`, setAiLoading, setAiOutput)}
                    disabled={!docInput || aiLoading}
                 >
                    <Wand2 size={16} className="mr-2" /> Polish Grammar
                 </Button>
                 <Button 
                    variant="secondary"
                    onClick={() => callGemini(`Translate the following text to Spanish:\n\n${docInput}`, setAiLoading, setAiOutput)}
                    disabled={!docInput || aiLoading}
                 >
                    <RefreshCw size={16} className="mr-2" /> Translate to Spanish
                 </Button>
                 <Button 
                    variant="secondary"
                    onClick={() => callGemini(`Extract action items and to-dos from this text:\n\n${docInput}`, setAiLoading, setAiOutput)}
                    disabled={!docInput || aiLoading}
                 >
                    <Check size={16} className="mr-2" /> Extract Actions
                 </Button>
              </div>
           </div>

           {/* Output Column */}
           <div className="flex flex-col h-[500px] md:h-full">
              <Card className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 border-gray-200">
                 <div className="p-3 border-b border-gray-200 bg-white flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                       {aiLoading ? <Loader2 size={12} className="animate-spin text-blue-500" /> : <Sparkles size={12} className="text-purple-500" />}
                       AI Result
                    </span>
                    {aiOutput && (
                       <button className="text-gray-400 hover:text-gray-600" onClick={() => navigator.clipboard.writeText(aiOutput)}>
                          <Copy size={14} />
                       </button>
                    )}
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto">
                    {aiLoading ? (
                       <div className="space-y-3 animate-pulse">
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                       </div>
                    ) : aiOutput ? (
                       <div className="prose prose-sm prose-gray max-w-none whitespace-pre-wrap">
                          {aiOutput}
                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-4">
                          <Sparkles size={32} className="mb-2 text-gray-300" />
                          <p className="text-sm">AI output will appear here.</p>
                       </div>
                    )}
                 </div>
              </Card>
           </div>
        </div>
      </div>
    );
  };

  // --- Render Layout Logic ---

  if (view === 'landing') return <LandingPage />;

  return (
    <div className={`min-h-screen bg-white text-gray-900 font-sans flex ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      
      <main className="flex-1 md:ml-64 transition-all">
        {/* Mobile Header */}
        <header className="h-16 border-b border-gray-200 flex md:hidden items-center justify-between px-4 sticky top-0 bg-white z-30">
           <div className="font-bold">ConvertHub.</div>
           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-gray-100 rounded">
             <MoreHorizontal size={20} />
           </button>
        </header>

        {/* Top Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-gray-200 items-center justify-between px-8 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-gray-400">
             <span>Workspace</span> <span className="text-gray-300">/</span> <span className="text-gray-900 font-medium capitalize">{view.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-gray-500 hover:text-black transition-colors"><Sun size={18} /></button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 md:p-8 min-h-[calc(100vh-64px)] bg-gray-50/50">
          {view === 'dashboard' && <DashboardHome />}
          {view === 'tool-image' && <ImageTools />}
          {view === 'tool-pdf' && <PdfTools />}
          {view === 'tool-doc' && <SmartDocTools />}
          {view === 'history' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Loader2 size={32} className="animate-spin text-gray-300" />
               </div>
               <p>Coming Soon</p>
            </div>
          )}
        </div>
      </main>

      {/* Processing Toast / Global Status */}
      {processing && (
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
      )}

      {completed && !files.length && view !== 'tool-image' && (
         <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-start gap-3">
               <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Check size={20} />
               </div>
               <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Download Ready</h4>
                  <p className="text-xs text-gray-500 mb-2">Your files have been processed successfully.</p>
                  <div className="flex gap-2">
                     <Button size="sm" className="h-8 text-xs w-full" onClick={() => setCompleted(false)}>Download Zip</Button>
                  </div>
               </div>
               <button onClick={() => setCompleted(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
         </div>
      )}
    </div>
  );
}