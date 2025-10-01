import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSwitchToSignUp = () => setShowSignUp(true);
  const handleSwitchToLogin = () => setShowSignUp(false);

  return (
    <>
      {showSignUp ? (
        <SignUp onSignUpSuccess={onAuthSuccess} onSwitchToLogin={handleSwitchToLogin} />
      ) : (
        <Login onLoginSuccess={onAuthSuccess} onSwitchToSignUp={handleSwitchToSignUp} />
      )}
    </>
  );
};

export default AuthPage;
