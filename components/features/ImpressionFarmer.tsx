
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
        className="w-full h-32 p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300 shadow-inner"
      />

      <button
        onClick={handleGenerate}
        disabled={isLoading || !originalPost.trim()}
        className="mt-6 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Impression Farming Reply'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ImpressionFarmer;