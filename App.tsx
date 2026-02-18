import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import EditorInput from './components/EditorInput';
import ResultDisplay from './components/ResultDisplay';
import LoadingAnimation from './components/LoadingAnimation';
import { ProofreadResult, LoadingState } from './types';
import { proofreadText } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<ProofreadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProofread = useCallback(async (text: string) => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await proofreadText(text);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while connecting to the AI service. Please try again.");
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Welcome */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 font-sans">
            ตรวจคำผิดภาษาไทยด้วย AI
          </h2>
          <p className="text-slate-500 text-lg font-body">
            Professional Thai proofreading that preserves your unique tone and style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input */}
          <section className="h-full">
            <EditorInput 
              onProofread={handleProofread} 
              loadingState={loadingState}
              changes={result?.changes}
            />
          </section>

          {/* Right Column: Output */}
          <section className="min-h-[400px]">
            {loadingState === LoadingState.ERROR && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
                <AlertTriangle className="flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {loadingState === LoadingState.SUCCESS && result && (
              <ResultDisplay result={result} />
            )}

            {loadingState === LoadingState.IDLE && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <p className="text-center font-medium">Enter your text on the left to start proofreading.</p>
              </div>
            )}

             {loadingState === LoadingState.LOADING && (
               <div className="h-full flex items-center justify-center">
                 <LoadingAnimation />
               </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Thai Proofreader AI. Built with Google Gemini.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;