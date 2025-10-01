
import React, { useState } from 'react';
import { signUp } from '../../services/authService';
import AuthWrapper from './AuthWrapper';
import Loader from '../Loader';
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    const result = await signUp(email, password, inviteCode);
    if (result.success) {
      onSignUpSuccess();
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <AuthWrapper title="Create your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition" placeholder="you@email.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <input id="password" name="password" type={isPasswordVisible ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition pr-10" placeholder="6+ characters" />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="inviteCode" className="block text-sm font-medium text-slate-300 mb-2">Invite Code</label>
          <input id="inviteCode" name="inviteCode" type="text" required value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="w-full p-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition" placeholder="KAITO-FRIEND-1" />
        </div>

        {error && (
            <div className="flex items-start space-x-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg p-3">
                <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
            </div>
        )}
        
        {isLoading && <div className="h-10 -mb-6"><Loader /></div>}

        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
            Create Account
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-cyan-400 hover:text-cyan-300">
          Sign in
        </button>
      </p>
    </AuthWrapper>
  );
};

export default SignUp;