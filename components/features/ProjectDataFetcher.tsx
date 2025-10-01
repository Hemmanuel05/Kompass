
import React, { useState, useCallback } from 'react';
import { fetchKaitoProjects } from '../../services/geminiService';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';

const ProjectDataFetcher: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = useCallback(async () => {
    setIsLoading(true);
    setResult('');
    setError(null);
    setLastFetched(null);
    try {
      const response = await fetchKaitoProjects();
      if (response.includes('ERROR: UNABLE_TO_FETCH_PROJECTS')) {
        setError('The AI agent could not read the project list from the Kaito website. The site structure may have changed. Please try again later.');
      } else if (response.toLowerCase().includes('error occurred')) {
         setError('An unexpected error occurred while trying to fetch data. Please check your connection and try again.');
      }
      else {
        setResult(response);
        setLastFetched(new Date().toLocaleString());
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while trying to fetch data. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
       <div className="bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 text-center">
            <p className="text-slate-400 mb-4">
                Click the button below to use an AI agent to fetch a fresh list of projects directly from the Kaito yapper leaderboards.
            </p>
            <button
                onClick={handleFetch}
                disabled={isLoading}
                className="font-bold py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Fetching Projects...' : 'Fetch Live Project List'}
            </button>
            {lastFetched && !isLoading && !error && (
                <p className="text-xs text-slate-500 mt-3">Last fetched: {lastFetched}</p>
            )}
       </div>

      {error && (
        <div className="mt-6 flex items-start space-x-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg p-4 animate-fade-in">
            <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading && <Loader />}
      {result && !error && <ResultDisplay content={result} />}
    </div>
  );
};

export default ProjectDataFetcher;