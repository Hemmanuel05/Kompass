
import React, { useState, useCallback } from 'react';
import { reviewPostClarity } from '../../services/geminiService';
import Loader from '../Loader';
import ClipboardIcon from '../icons/ClipboardIcon';

const ContentClarityHelper: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed!');
       setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };

  const handleReview = useCallback(async () => {
    if (!draft.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await reviewPostClarity(draft);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to get review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [draft]);

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Draft your post here..."
        className="w-full h-40 p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300 shadow-inner"
      />
      <button
        onClick={handleReview}
        disabled={isLoading || !draft.trim()}
        className="mt-6 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Get Feedback'}
      </button>

      {isLoading && <Loader />}
      {result && (
        <div className="relative bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 mt-6">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center px-3 py-1 bg-slate-800/70 text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-700/70 transition-colors disabled:cursor-not-allowed"
            aria-label="Copy to clipboard"
            disabled={copyStatus !== 'Copy'}
          >
            {copyStatus === 'Copy' && <ClipboardIcon className="w-4 h-4 mr-2" />}
            {copyStatus}
          </button>
          <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentClarityHelper;