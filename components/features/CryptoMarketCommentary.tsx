
import React, { useState, useCallback } from 'react';
import { generateMarketCommentary } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const CryptoMarketCommentary: React.FC = () => {
  const [news, setNews] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!news.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await generateMarketCommentary(news);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to generate commentary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [news]);

  return (
    <div>
      <textarea
        value={news}
        onChange={(e) => setNews(e.target.value)}
        placeholder="Paste recent crypto news or an announcement here..."
        className="w-full h-40 p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300 shadow-inner"
      />

      <button
        onClick={handleGenerate}
        disabled={isLoading || !news.trim()}
        className="mt-6 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Generate Commentary'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default CryptoMarketCommentary;