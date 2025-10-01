
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
        className="w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
      />
      <button
        onClick={handleFind}
        disabled={isLoading || !interests.trim()}
        className="mt-4 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Finding...' : 'Find Conversations'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ConversationFinder;