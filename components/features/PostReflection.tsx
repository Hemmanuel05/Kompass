
import React, { useState, useCallback } from 'react';
import { reflectOnPost } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';

const PostReflection: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [likes, setLikes] = useState('');
  const [retweets, setRetweets] = useState('');
  const [replies, setReplies] = useState('');
  const [impressions, setImpressions] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleReflect = useCallback(async () => {
    setIsLoading(true);
    setResult('');
    try {
      const response = await reflectOnPost({
        postText,
        likes: Number(likes) || 0,
        retweets: Number(retweets) || 0,
        replies: Number(replies) || 0,
        impressions: Number(impressions) || 0,
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult('Failed to reflect on post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [postText, likes, retweets, replies, impressions]);

  const isButtonDisabled = isLoading || (!postText.trim() && !impressions.trim());

  return (
    <div>
      <div className="bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <label htmlFor="postText" className="block text-sm font-medium text-slate-300 mb-2">Post Text (Optional)</label>
          <textarea
            id="postText"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Paste the text of your post here..."
            className="w-full h-28 p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 shadow-inner placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="impressions" className="block text-sm font-medium text-slate-300 mb-2">Impressions</label>
            <input
              id="impressions"
              type="number"
              value={impressions}
              onChange={(e) => setImpressions(e.target.value)}
              placeholder="e.g., 15000"
              className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
            />
          </div>
          <div>
            <label htmlFor="likes" className="block text-sm font-medium text-slate-300 mb-2">Likes</label>
            <input
              id="likes"
              type="number"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="e.g., 350"
              className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
            />
          </div>
          <div>
            <label htmlFor="retweets" className="block text-sm font-medium text-slate-300 mb-2">Retweets</label>
            <input
              id="retweets"
              type="number"
              value={retweets}
              onChange={(e) => setRetweets(e.target.value)}
              placeholder="e.g., 45"
              className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
            />
          </div>
          <div>
            <label htmlFor="replies" className="block text-sm font-medium text-slate-300 mb-2">Replies</label>
            <input
              id="replies"
              type="number"
              value={replies}
              onChange={(e) => setReplies(e.target.value)}
              placeholder="e.g., 15"
              className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={handleReflect}
        disabled={isButtonDisabled}
        className="mt-6 font-bold py-3 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Performance'}
      </button>

      {isLoading && <Loader />}
      {result && <ResultDisplay content={result} />}
    </div>
  );
};

export default PostReflection;
