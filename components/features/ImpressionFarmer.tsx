
import React, { useState, useCallback } from 'react';
import { generateImpressionReply } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const ImpressionFarmer: React.FC = () => {
  const [originalPost, setOriginalPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!originalPost.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await generateImpressionReply(originalPost);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to generate reply. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalPost]);

  return (
    <div>
      <textarea
        value={originalPost}
        onChange={(e) => setOriginalPost(e.target.value)}
        placeholder="Paste the viral/trending post here to generate a reply..."
        className="w-full h-32 p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 shadow-inner placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
      />

      <button
        onClick={handleGenerate}
        disabled={isLoading || !originalPost.trim()}
        className="mt-6 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Generating...' : 'Generate Impression Farming Reply'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ImpressionFarmer;