import React, { useState } from 'react';
import { ProofreadResult, ChangeItem } from '../types';
import { CheckCircle2, Copy, AlertCircle, Type, BookText, ArrowRight } from 'lucide-react';

interface ResultDisplayProps {
  result: ProofreadResult;
}

const ChangeCard: React.FC<{ change: ChangeItem }> = ({ change }) => {
  const [copied, setCopied] = useState(false);

  const typeColors = {
    spelling: 'bg-red-50 text-red-700 border-red-100',
    grammar: 'bg-orange-50 text-orange-700 border-orange-100',
    spacing: 'bg-blue-50 text-blue-700 border-blue-100',
    other: 'bg-slate-50 text-slate-700 border-slate-100',
  };

  const typeLabels = {
    spelling: 'สะกดคำ',
    grammar: 'ไวยากรณ์',
    spacing: 'เว้นวรรค',
    other: 'อื่นๆ'
  };

  const handleCopy = () => {
    if (change.corrected && change.corrected !== "(removed)") {
      navigator.clipboard.writeText(change.corrected);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCopyable = change.corrected && change.corrected !== "(removed)";

  return (
    <div className="bg-white rounded-lg border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group relative">
      {isCopyable && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md text-slate-400 hover:text-green-600 hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Copy corrected word"
        >
          {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
        </button>
      )}
      
      <div className="flex justify-between items-start mb-2 pr-6">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${typeColors[change.type] || typeColors.other}`}>
          {typeLabels[change.type] || change.type}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-2 font-body text-base flex-wrap">
        <span className="text-red-500 line-through decoration-red-300/50 bg-red-50/50 px-1 rounded">
          {change.original || "(blank)"}
        </span>
        <ArrowRight size={14} className="text-slate-300 flex-shrink-0" />
        <span className="text-green-600 font-semibold bg-green-50/50 px-1 rounded break-all">
          {change.corrected || "(removed)"}
        </span>
      </div>
      <p className="text-xs text-slate-500">{change.explanation}</p>
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.corrected_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Corrected Text Section - Moved to top for alignment */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            Corrected Text
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
        <div className="p-6 font-body text-lg leading-relaxed text-slate-800 min-h-[300px] whitespace-pre-wrap">
          {result.corrected_text}
        </div>
      </div>

      {/* Overall Comment Section - Compacted and moved down */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex gap-3 items-start">
        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-600 flex-shrink-0 mt-0.5">
          <BookText size={16} />
        </div>
        <div>
          <h3 className="font-semibold text-indigo-900 text-sm mb-0.5">Comment from AI Editor</h3>
          <p className="text-indigo-800 text-xs font-body leading-relaxed">{result.overall_comment}</p>
        </div>
      </div>

      {/* Changes List */}
      <div className="mt-2">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="text-slate-400" />
          Detailed Changes ({result.changes.length})
        </h3>
        
        {result.changes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.changes.map((change, index) => (
              <ChangeCard key={index} change={change} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
            <CheckCircle2 size={24} className="mx-auto mb-2 text-green-400" />
            <p className="text-sm">No issues found! Your text looks great.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;