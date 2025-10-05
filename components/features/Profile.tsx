import React, { useState } from 'react';
import { User } from '../../services/authService';

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [betaFeatures, setBetaFeatures] = useState(false);

  if (!user) {
    return (
      <div className="text-center text-slate-400">
        Loading profile information...
      </div>
    );
  }

  const handleDeleteAccount = () => {
    // In a real app, this would trigger a confirmation modal and then an API call.
    // For now, it's just a placeholder.
    alert('Account deletion is not implemented in this demo.');
  };

  return (
    <div className="space-y-8">
      {/* Account Information Section */}
      <div className="bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-400">Email Address</label>
            <p className="text-slate-200 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="beta-toggle" className="font-medium text-slate-200">Enable Beta Features</label>
            <p className="text-sm text-slate-400">Get early access to new tools and features.</p>
          </div>
          <button
            id="beta-toggle"
            role="switch"
            aria-checked={betaFeatures}
            onClick={() => setBetaFeatures(!betaFeatures)}
            className={`${
              betaFeatures ? 'bg-cyan-500' : 'bg-slate-700'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
          >
            <span
              aria-hidden="true"
              className={`${
                betaFeatures ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-slate-900/50 backdrop-blur-lg border-2 border-red-900/80 rounded-xl p-6">
        <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-slate-400 mb-4 text-sm max-w-2xl">
          These actions are irreversible. Please be certain before proceeding.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 border border-red-700 text-sm font-medium rounded-md text-red-400 bg-red-900/40 hover:bg-red-900/70 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
