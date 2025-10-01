
import React, { useState, useCallback } from 'react';
import { exploreTopicAngles } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const ContentIdeas: React.FC = () => {
  const [topicArea, setTopicArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleExplore = useCallback(async () => {
    if (!topicArea.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await exploreTopicAngles(topicArea);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to get ideas. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topicArea]);

  return (
    <div>
      <p className="text-slate-400 mb-4">"What am I curious about?" Helper questions: What have I learned recently? What confuses me? What do others get wrong?</p>
      <input
        type="text"
        value={topicArea}
        onChange={(e) => setTopicArea(e.target.value)}
        placeholder="Enter your area of interest or expertise (e.g., DeFi, AI art, Web3 gaming)"
        className="w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
      />
      <button
        onClick={handleExplore}
        disabled={isLoading || !topicArea.trim()}
        className="mt-4 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Generating...' : 'Give Me Some Angles'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ContentIdeas;