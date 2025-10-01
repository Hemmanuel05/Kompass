
import React, { useState, useCallback } from 'react';
import { generateInspiredOriginal } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const InspiredOriginalGenerator: React.FC = () => {
  const [originalPost, setOriginalPost] = useState('');
  const [includeBridge, setIncludeBridge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!originalPost.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await generateInspiredOriginal(originalPost, includeBridge);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalPost, includeBridge]);

  return (
    <div>
      <textarea
        value={originalPost}
        onChange={(e) => setOriginalPost(e.target.value)}
        placeholder="Paste a smart follower's post here to generate an 'inspired original'..."
        className="w-full h-40 p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 shadow-inner placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
      />

      <div className="mt-4 flex items-center">
        <input
          id="bridge-toggle"
          type="checkbox"
          checked={includeBridge}
          onChange={(e) => setIncludeBridge(e.target.checked)}
          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/80"
        />
        <label htmlFor="bridge-toggle" className="ml-3 block text-sm font-medium text-slate-300">
          Include "Bridge Accessible" version for Web2 audience
        </label>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !originalPost.trim()}
        className="mt-6 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Transforming...' : 'Generate Inspired Original'}
      </button>

      {isLoading && <Loader />}
      {result && (
        <div className="mt-6 animate-fade-in">
          <ResultDisplay content={result} />
        </div>
      )}
    </div>
  );
};

export default InspiredOriginalGenerator;