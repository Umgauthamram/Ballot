
import React from 'react';
import { useApp } from '../store';
import { LogOut, ShieldCheck, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { currentUser, logout, setView, currentView } = useApp();

  const handleLogoClick = () => {
    if (currentUser) {
      setView(currentUser.isAdmin ? 'ADMIN_PANEL' : 'STUDENT_DASHBOARD');
    } else {
      setView('LANDING');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
    
      <header className="border-b border-white/20 p-4 sticky top-0 z-40 bg-black/95 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
         
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xl">
              B
            </div>
            <span className="font-bold tracking-[0.2em] -ml-2 text-lg hidden sm:block">
              ALLOT
            </span>
          </div>

          {/* User Controls */}
          {currentUser && (
            <div className="flex items-center gap-4">
              {/* User Info (desktop) */}
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-xs text-gray-500 uppercase tracking-widest">
                  Logged in as
                </span>
                <span className="text-sm font-bold flex items-center gap-2">
                  {currentUser.name.toUpperCase()}
                  {currentUser.isAdmin && <ShieldCheck size={14} className="text-green-400" />}
                </span>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-800 mx-2 hidden md:block" />

              {/* Settings Button */}
              <Link
                to="/settings"
                className={`border p-2 transition-all duration-200 ${
                  currentView === 'SETTINGS'
                    ? 'bg-white text-black border-white'
                    : 'border-white/50 hover:bg-white hover:text-black'
                }`}
                title="Settings"
              >
                <SettingsIcon size={16} />
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="border border-white/50 p-2 hover:bg-white hover:text-black transition-all duration-200"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 p-6 text-center">
        <p className="text-xs text-gray-600 uppercase tracking-widest">
          System Version 5.0 • Immutable Campus Voting • Ledger Active
        </p>
      </footer>
    </div>
  );
};

export default Layout;