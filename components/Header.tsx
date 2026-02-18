import React from 'react';
import { BookOpenCheck, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-500 p-2 rounded-lg text-white">
            <BookOpenCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
              Thai Proofreader
            </h1>
            <p className="text-xs text-slate-500 font-medium">AI-Powered Editor</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          <Sparkles size={14} className="text-yellow-500" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;