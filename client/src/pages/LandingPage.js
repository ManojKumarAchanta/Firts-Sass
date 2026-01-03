import React from 'react';
import { UploadCloud, FileImage, Files, Settings, Zap, X, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

export const LandingPage = () => {
  const { setView, landingMenuOpen, setLandingMenuOpen } = useApp();

  return (
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
};

