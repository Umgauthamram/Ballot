import React from 'react';
import { useApp } from '../store';
import  Button  from '../ui/button';
import ProfileInfo from '../components/ProfileInfo';
import ChangePasswordForm from '../components/ChangePassword';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { currentUser, changePassword, setView } = useApp();

  if (!currentUser) return null;

  const goBack = () => {
    setView(currentUser.isAdmin ? 'ADMIN_PANEL' : 'STUDENT_DASHBOARD');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
 
      <div className="flex items-center justify-between border-b-2 border-white/30 pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">
          System Configuration
        </h1>
        <Link to="/dashboard">
        <Button variant="ghost" onClick={goBack} className="text-lg">
          ← Return
        </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProfileInfo user={currentUser} />
        <ChangePasswordForm onChangePassword={changePassword} />
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-gray-600 uppercase tracking-widest border-t border-white/10 pt-8 mt-20">
        BALLOT_SYS_V5.0 • Immutable Campus Voting • All identity data stored off-chain for privacy
      </div>
    </div>
  );
};

export default Settings;