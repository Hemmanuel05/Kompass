
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { analyzeKaitoProject } from '../../services/geminiService';
import { findProjectByName, KaitoProject, kaitoProjects } from '../../data/kaito-projects';
import Loader from '../Loader';
import ResultDisplay from '../ResultDisplay';
import SearchIcon from '../icons/SearchIcon';

const ANGLE_OPTIONS = [
    { value: "not sure yet", label: "not sure yet" },
    { value: "technical", label: "how it actually works" },
    { value: "team", label: "who's building this" },
    { value: "tokenomics", label: "token structure and incentives" },
    { value: "competition", label: "how it compares to alternatives" },
    { value: "risks", label: "potential concerns or red flags" }
];

const KaitoProjectHelper: React.FC = () => {
    const [projectName, setProjectName] = useState('');
    const [knownInfo, setKnownInfo] = useState('');
    const [angle, setAngle] = useState('not sure yet');
    const [projectData, setProjectData] = useState<KaitoProject | undefined>(undefined);
  
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const [suggestions, setSuggestions] = useState<KaitoProject[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const project = findProjectByName(projectName);
            setProjectData(project);
        }, 300); // Debounce check
        return () => clearTimeout(timeoutId);
    }, [projectName]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleAnalyze = useCallback(async () => {
        if (!projectName.trim()) {
            setError('please tell me which project you\'re curious about.');
            return;
        }
        setError('');
        setIsLoading(true);
        setResult('');
        try {
            const response = await analyzeKaitoProject({
                projectName,
                existingKnowledge: knownInfo,
                contentAngle: angle,
            });
            if (response.toLowerCase().includes('error occurred')) {
                setError('something went wrong, try again in a bit');
                setResult('');
            } else {
                setResult(response);
            }
        } catch (e) {
            console.error(e);
            setError('something went wrong, try again in a bit');
        } finally {
            setIsLoading(false);
        }
    }, [projectName, knownInfo, angle]);

    const isButtonDisabled = isLoading || !projectName.trim();

    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProjectName(value);

        if (value.trim().length > 0) {
            const filteredSuggestions = kaitoProjects.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setIsSuggestionsVisible(filteredSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setIsSuggestionsVisible(false);
        }
    };
    
    const handleSuggestionClick = (project: KaitoProject) => {
        setProjectName(project.name);
        setSuggestions([]);
        setIsSuggestionsVisible(false);
    };

    return (
        <div>
            <div className="bg-blue-950/50 border border-blue-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                    <strong>Note:</strong> This tool uses our verified list and web search for project info, but can't guarantee everything is 100% current. 
                    Always verify campaign details at <a href="https://yaps.kaito.ai" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-100">yaps.kaito.ai</a> before posting.
                </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="relative" ref={wrapperRef}>
                    <label htmlFor="projectName" className="block text-sm font-medium text-slate-300 mb-2">what project are you curious about?</label>
                    <input 
                        id="projectName" 
                        type="text" 
                        value={projectName} 
                        onChange={handleProjectNameChange}
                        onFocus={() => {
                            if (projectName.trim().length > 0) {
                                const filteredSuggestions = kaitoProjects.filter(p => p.name.toLowerCase().includes(projectName.toLowerCase()));
                                if (filteredSuggestions.length > 0) {
                                    setSuggestions(filteredSuggestions);
                                    setIsSuggestionsVisible(true);
                                }
                            }
                        }}
                        placeholder="infinex, monad, etc." 
                        className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"
                        autoComplete="off"
                    />
                     {isSuggestionsVisible && suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-slate-900 border border-slate-600 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                            {suggestions.map(project => (
                                <li 
                                    key={project.id}
                                    onClick={() => handleSuggestionClick(project)}
                                    className="px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-cyan-500 hover:text-white transition-colors"
                                >
                                    {project.name}
                                </li>
                            ))}
                        </ul>
                    )}
                     {projectData && (
                        <div className="mt-2 text-sm text-green-400 flex items-center animate-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            We have this on our verified list.
                        </div>
                    )}
                    {!projectData && projectName.trim().length > 2 && !isSuggestionsVisible && (
                        <div className="mt-2 text-sm text-sky-400 flex items-center animate-fade-in">
                           <SearchIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            Not on our verified list. We'll use a web search to help you get started.
                        </div>
                    )}
                </div>
                 <div>
                    <label htmlFor="knownInfo" className="block text-sm font-medium text-slate-300 mb-2">what do you already know about them?</label>
                    <textarea id="knownInfo" value={knownInfo} onChange={(e) => setKnownInfo(e.target.value)} placeholder="just that they're doing some defi thing..." rows={3} className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 placeholder-slate-500 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]"></textarea>
                </div>
                <div>
                    <label htmlFor="angle" className="block text-sm font-medium text-slate-300 mb-2">what angle interests you?</label>
                    <select id="angle" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500/80 focus:border-cyan-500 outline-none transition-all duration-300 text-slate-200 focus:shadow-[0_0_15px_#06b6d440]">
                      {ANGLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">{opt.label}</option>)}
                    </select>
                </div>
                <button onClick={handleAnalyze} disabled={isButtonDisabled} className="w-full font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/40 transform transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">
                    {isLoading ? 'thinking through this...' : 'help me think through this'}
                </button>
            </div>
            
            {error && <div className="mt-4 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">{error}</div>}
      
            {isLoading && <Loader />}
            {!result && !isLoading && !error && (
                <div className="mt-8 text-center text-slate-500">
                    <p>pick a project you're curious about and we'll help you figure out what to write about it</p>
                </div>
            )}
            {result && <ResultDisplay content={result} />}
        </div>
    );
};

export default KaitoProjectHelper;