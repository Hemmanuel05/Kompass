
import React, { useState } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';

interface ResultDisplayProps {
  content: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed!');
       setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };

  const formattedContent = content.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-cyan-400 mt-4 mb-2">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3 border-b border-slate-700 pb-2">{line.substring(3)}</h2>;
    }
    // FIX: Updated title from `**CRYPTO NATIVE:**` to `**STEALTH NATIVE:**` to match updated prompt.
    if (line.startsWith('**STEALTH NATIVE:**') || line.startsWith('**BRIDGE ACCESSIBLE:**')) {
      return <h3 key={index} className="text-lg font-semibold text-cyan-400 mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <h3 key={index} className="text-lg font-semibold text-cyan-400 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
    }
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>;
    }
    if (line.startsWith('*') && line.endsWith('*')) {
      return <p key={index} className="mb-2 italic text-slate-400">{line.slice(1, -1)}</p>;
    }
     if (/^\d+\./.test(line)) {
      return <li key={index} className="ml-6 list-decimal">{line.substring(line.indexOf('.') + 1).trim()}</li>;
    }
    // Render bold text within lines
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={index} className="mb-2">
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 mt-6 whitespace-pre-wrap font-sans">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center px-3 py-1 bg-slate-800/70 text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-700/70 transition-colors disabled:cursor-not-allowed"
        aria-label="Copy to clipboard"
        disabled={copyStatus !== 'Copy'}
      >
        {copyStatus === 'Copy' && <ClipboardIcon className="w-4 h-4 mr-2" />}
        {copyStatus}
      </button>
      {formattedContent}
    </div>
  );
};

export default ResultDisplay;