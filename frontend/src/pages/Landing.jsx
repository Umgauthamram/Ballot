import React from 'react';
import { useApp } from '../store';
import { Shield, Lock, Database, Eye, LogIn, UserPlus} from 'lucide-react';
import { Link } from "react-router-dom";

const Landing = () => {
  const { setView } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between py-20 px-8 bg-black text-white font-mono">

     

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-16 max-w-6xl mx-auto">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
          IMMUTABLE<br />
          <span className="text-green-500">CAMPUS</span><br />
          VOTING
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl">
          A decentralized, cryptographically secure voting protocol built for transparency, privacy, and trust.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 mt-16">
          <Link
            to="/login"
            
            className="group flex items-center gap-5 border border-white/60 px-10 py-5 hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-sm uppercase tracking-widest font-bold"
          >
            <LogIn size={20} className="group-hover:scale-110 transition-transform" />
            <span>Access Portal</span>
            <div className="w-16 h-px bg-current opacity-50 ml-4"></div>
          </Link>

          <Link
            to="/signup"
            className="group flex items-center gap-5 border border-white/30 px-10 py-5 hover:border-white/70 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest text-gray-400"
          >
            <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
            <span>Student Registration</span>
            <div className="w-16 h-px bg-current opacity-30 ml-4"></div>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-white/10 pt-20">
        {[
          { icon: Shield, title: 'Zero Trust', desc: 'Voter identity never revealed' },
          { icon: Database, title: 'Immutable', desc: 'Votes cannot be altered' },
          { icon: Eye, title: 'Transparent', desc: 'Publicly auditable ledger' },
          { icon: Lock, title: 'Encrypted', desc: 'End-to-end security' }
        ].map((f, i) => (
          <div key={i} className="text-center space-y-5">
            <f.icon size={40} className="mx-auto text-green-500" />
            <h3 className="text-lg font-bold uppercase tracking-widest">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed px-4">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Landing;