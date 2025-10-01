
import React from 'react';

interface AuthWrapperProps {
  title: string;
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-[#0A0F1F] text-slate-200 flex flex-col justify-center items-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">
            Kaito <span className="text-cyan-400">Kompass</span>
          </h1>
          <p className="mt-2 text-slate-400">{title}</p>
        </header>
        <main className="bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl shadow-2xl shadow-cyan-500/5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthWrapper;