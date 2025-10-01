
import React, { useState, useCallback } from 'react';
import { continueConversation } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const ConversationContinuator: React.FC = () => {
  const [conversationHistory, setConversationHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!conversationHistory.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await continueConversation(conversationHistory);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to generate follow-up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  return (
    <div>
      <textarea
        value={conversationHistory}
        onChange={(e) => setConversationHistory(e.target.value)}
        placeholder="Paste the conversation history here. Start with the oldest message and end with the most recent."
        className="w-full h-64 p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300 shadow-inner"
      />
      <button
        onClick={handleGenerate}
        disabled={isLoading || !conversationHistory.trim()}
        className="mt-6 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Thinking...' : 'Suggest Follow-up Replies'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default ConversationContinuator;