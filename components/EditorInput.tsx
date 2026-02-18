import React, { useState, useEffect, useRef } from 'react';
import { Eraser, PenLine, AlertCircle, Sparkles } from 'lucide-react';
import { LoadingState, ChangeItem } from '../types';

interface EditorInputProps {
  onProofread: (text: string) => void;
  loadingState: LoadingState;
  changes?: ChangeItem[];
}

const EditorInput: React.FC<EditorInputProps> = ({ onProofread, loadingState, changes }) => {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically switch to view mode (highlighting) when changes arrive
  useEffect(() => {
    if (loadingState === LoadingState.SUCCESS && changes && changes.length > 0) {
      setIsEditing(false);
    } else if (loadingState === LoadingState.LOADING) {
      setIsEditing(true); // Ensure we are in edit mode while loading so textarea is disabled properly
    }
  }, [loadingState, changes]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim() && loadingState !== LoadingState.LOADING) {
      onProofread(text);
    }
  };

  const handleClear = () => {
    setText('');
    setIsEditing(true);
    // Focus textarea after clearing for better UX
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const switchToEdit = () => {
    setIsEditing(true);
    // Slight timeout to allow render, then focus and move cursor to end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
      }
    }, 0);
  };

  // Function to render text with highlights
  const renderHighlightedText = () => {
    if (!changes || changes.length === 0) return text;

    // Sort changes by length (descending) to match longest phrases first
    // Filter out empty originals just in case
    const uniqueOriginals = Array.from(new Set(changes.map(c => c.original).filter((s) => typeof s === 'string' && s.length > 0))) as string[];
    const sortedOriginals = uniqueOriginals.sort((a, b) => b.length - a.length);

    if (sortedOriginals.length === 0) return text;

    // Create a regex to match all original incorrect words
    // We escape special regex characters in the originals
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(${sortedOriginals.map(escapeRegExp).join('|')})`, 'g');

    // Split text by the pattern
    const parts = text.split(pattern);

    return parts.map((part, index) => {
      // Check if this part matches one of our error words
      const isError = sortedOriginals.some(orig => orig === part);
      
      if (isError) {
        return (
          <span 
            key={index} 
            className="bg-red-100 text-red-700 border-b-2 border-red-300 decoration-red-400 font-medium rounded-sm px-0.5 mx-0.5 cursor-help"
            title="Potential Error"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative group">
      <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center sticky top-0 z-20 backdrop-blur-sm">
        <h2 className="font-semibold text-slate-700 flex items-center gap-2 pl-2">
          <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
          Original Text
        </h2>
        
        <div className="flex items-center gap-1">
           {/* Clear Button */}
           <button
            onClick={handleClear}
            type="button"
            className="text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            disabled={loadingState === LoadingState.LOADING}
            title="Clear all text"
          >
            <Eraser size={14} />
            <span className="hidden sm:inline">ลบ</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

           {/* Primary Action Button - Proofread / Edit */}
           {isEditing && (
             <button
              onClick={() => handleSubmit()}
              disabled={!text.trim() || loadingState === LoadingState.LOADING}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all
                ${!text.trim() || loadingState === LoadingState.LOADING
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow active:scale-95'
                }
              `}
            >
              {loadingState === LoadingState.LOADING ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Proofread</span>
                </>
              )}
            </button>
           )}

           {!isEditing && (
            <button
              onClick={switchToEdit}
              type="button"
              className="text-xs text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-medium border border-primary-100"
            >
              <PenLine size={14} /> Edit
            </button>
           )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative min-h-[400px]">
        <div className="flex-1 relative">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="วางข้อความภาษาไทยที่คุณต้องการตรวจสอบที่นี่..."
              className="w-full h-full p-6 resize-none outline-none bg-white text-slate-900 font-body text-lg leading-relaxed placeholder:text-slate-300 appearance-none absolute inset-0"
              disabled={loadingState === LoadingState.LOADING}
            />
          ) : (
            <div 
              onClick={switchToEdit}
              className="w-full h-full p-6 bg-white font-body text-lg leading-relaxed whitespace-pre-wrap overflow-y-auto cursor-text text-slate-900 hover:bg-slate-50/50 transition-colors absolute inset-0"
            >
               {renderHighlightedText()}
            </div>
          )}
          
          {/* Overlay hint when not editing */}
          {!isEditing && changes && changes.length > 0 && (
             <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                   <AlertCircle size={12} className="text-red-300" />
                   <span>Click text to edit</span>
                </div>
             </div>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-slate-50 bg-white flex justify-end items-center z-10">
          <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
            {text.length} Characters
          </span>
        </div>
      </form>
    </div>
  );
};

export default EditorInput;