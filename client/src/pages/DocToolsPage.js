import React from 'react';
import { ChevronRight, Sparkles, Wand2, RefreshCw, Check, Copy, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { geminiService } from '../services/apiService';

export const DocToolsPage = () => {
  const {
    docInput,
    setDocInput,
    aiOutput,
    setAiOutput,
    aiLoading,
    setAiLoading
  } = useApp();

  const callGemini = async (prompt) => {
    setAiLoading(true);
    try {
      const result = await geminiService.generateContent(prompt);
      setAiOutput(result);
    } catch (error) {
      console.error("Gemini Error:", error);
      setAiOutput("Sorry, I couldn't process that request right now.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSummarize = () => {
    callGemini(`Summarize the following text in 3 concise bullet points:\n\n${docInput}`);
  };

  const handlePolish = () => {
    callGemini(`Fix grammar and polish the tone of this text to be professional:\n\n${docInput}`);
  };

  const handleTranslate = () => {
    callGemini(`Translate the following text to Spanish:\n\n${docInput}`);
  };

  const handleExtractActions = () => {
    callGemini(`Extract action items and to-dos from this text:\n\n${docInput}`);
  };

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
                  <Button variant="ghost" className="h-6 text-xs" onClick={() => setDocInput('')}>Clear</Button>
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
                  onClick={handleSummarize}
                  disabled={!docInput || aiLoading}
                  loading={aiLoading}
               >
                  <Sparkles size={16} className="mr-2" /> Summarize
               </Button>
               <Button
                  variant="secondary"
                  onClick={handlePolish}
                  disabled={!docInput || aiLoading}
               >
                  <Wand2 size={16} className="mr-2" /> Polish Grammar
               </Button>
               <Button
                  variant="secondary"
                  onClick={handleTranslate}
                  disabled={!docInput || aiLoading}
               >
                  <RefreshCw size={16} className="mr-2" /> Translate to Spanish
               </Button>
               <Button
                  variant="secondary"
                  onClick={handleExtractActions}
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

