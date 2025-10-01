
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
        className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300"
      />
      <button
        onClick={handleExplore}
        disabled={isLoading || !topicArea.trim()}
        className="mt-4 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Give Me Some Angles'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ContentIdeas;