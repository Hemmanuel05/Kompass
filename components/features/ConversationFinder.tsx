
import React, { useState, useCallback } from 'react';
import { findRelevantConversations } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const ConversationFinder: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleFind = useCallback(async () => {
    if (!interests.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await findRelevantConversations(interests);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to find conversations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [interests]);

  return (
    <div>
      <input
        type="text"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        placeholder="Enter your areas of expertise/interest (e.g., ZK proofs, decentralized science, NFT standards)"
        className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300"
      />
      <button
        onClick={handleFind}
        disabled={isLoading || !interests.trim()}
        className="mt-4 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Finding...' : 'Find Conversations'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ConversationFinder;