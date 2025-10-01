
import React, { useState, useCallback } from 'react';
import { reflectOnPost } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const PostReflection: React.FC = () => {
  const [publishedPost, setPublishedPost] = useState('');
  const [likes, setLikes] = useState('');
  const [retweets, setRetweets] = useState('');
  const [replies, setReplies] = useState('');
  const [impressions, setImpressions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleReflect = useCallback(async () => {
    if (!publishedPost.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const engagementData = {
        likes: likes || '0',
        retweets: retweets || '0',
        replies: replies || '0',
        impressions: impressions || '0',
      };
      const response = await reflectOnPost(publishedPost, engagementData);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to reflect on post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [publishedPost, likes, retweets, replies, impressions]);

  return (
    <div>
      <textarea
        value={publishedPost}
        onChange={(e) => setPublishedPost(e.target.value)}
        placeholder="Paste your published post here..."
        className="w-full h-32 p-4 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition-all duration-300 shadow-inner"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div>
            <label htmlFor="likes" className="block text-sm font-medium text-slate-400 mb-1">Likes</label>
            <input type="number" id="likes" value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="e.g., 120" className="w-full p-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition" />
        </div>
        <div>
            <label htmlFor="retweets" className="block text-sm font-medium text-slate-400 mb-1">Retweets</label>
            <input type="number" id="retweets" value={retweets} onChange={(e) => setRetweets(e.target.value)} placeholder="e.g., 30" className="w-full p-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition" />
        </div>
        <div>
            <label htmlFor="replies" className="block text-sm font-medium text-slate-400 mb-1">Replies</label>
            <input type="number" id="replies" value={replies} onChange={(e) => setReplies(e.target.value)} placeholder="e.g., 15" className="w-full p-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition" />
        </div>
        <div>
            <label htmlFor="impressions" className="block text-sm font-medium text-slate-400 mb-1">Impressions</label>
            <input type="number" id="impressions" value={impressions} onChange={(e) => setImpressions(e.target.value)} placeholder="e.g., 5000" className="w-full p-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition" />
        </div>
      </div>
      <button
        onClick={handleReflect}
        disabled={isLoading || !publishedPost.trim()}
        className="mt-6 font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Performance'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default PostReflection;