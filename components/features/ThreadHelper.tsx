
import React, { useState, useCallback } from 'react';
import { structureThread } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const ThreadHelper: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [numPosts, setNumPosts] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleStructure = useCallback(async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await structureThread(topic, numPosts);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to structure thread. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, numPosts]);

  return (
    <div>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="What's your main idea or topic for the thread?"
        className="w-full h-32 p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300 shadow-inner"
      />
      <div className="mt-4">
        <label htmlFor="numPosts" className="block text-slate-400 mb-2">
          Approximate number of posts: <span className="font-bold text-white">{numPosts}</span>
        </label>
        <input
          id="numPosts"
          type="range"
          min="2"
          max="10"
          value={numPosts}
          onChange={(e) => setNumPosts(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>
      <button
        onClick={handleStructure}
        disabled={isLoading || !topic.trim()}
        className="mt-6 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Structuring...' : 'Help Me Structure This'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ThreadHelper;