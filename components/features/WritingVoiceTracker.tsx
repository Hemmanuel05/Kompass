
import React, { useState, useCallback } from 'react';
import { analyzeWritingVoice } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const WritingVoiceTracker: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleAnalyze = useCallback(async () => {
    if (!recentPosts.trim()) return;
    const postsArray = recentPosts.split('---').map(p => p.trim()).filter(p => p);
    if (postsArray.length === 0) return;

    setIsLoading(true);
    setResult('');
    try {
      const response = await analyzeWritingVoice(postsArray);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to analyze voice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [recentPosts]);

  return (
    <div>
      <textarea
        value={recentPosts}
        onChange={(e) => setRecentPosts(e.target.value)}
        placeholder="Paste several of your recent posts here, separated by '---' on a new line."
        className="w-full h-64 p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 shadow-inner placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
      />
      <button
        onClick={handleAnalyze}
        disabled={isLoading || !recentPosts.trim()}
        className="mt-4 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Analyzing...' : 'Analyze My Voice'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default WritingVoiceTracker;