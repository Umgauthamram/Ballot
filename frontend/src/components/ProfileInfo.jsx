import React from 'react';
import { Shield, User } from 'lucide-react';

const ProfileInfo = ({ user }) => {
  return (
    <div className="border border-white/20 p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white text-black p-3">
          {user.isAdmin ? <Shield size={24} /> : <User size={24} />}
        </div>
        <div>
          <h2 className="text-xl font-bold uppercase">Identity Profile</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Immutable • Read Only</p>
        </div>
      </div>

      <div className="space-y-5 font-mono text-sm">
        <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Full Name</label>
          <div className="border-b border-gray-700 pb-1 text-white">{user.name}</div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Student / Admin ID</label>
          <div className="border-b border-gray-700 pb-1 text-white">{user.studentId}</div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Email Address</label>
          <div className="border-b border-gray-700 pb-1 text-white">{user.email}</div>
        </div>
        {/* <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Institution</label>
          <div className="border-b border-gray-700 pb-1 text-white">{user.collegeName}</div>
        </div> */}
        {!user.isAdmin && (
          <div>
            <label className="block text-xs text-gray-500 uppercase mb-1">Department</label>
            <div className="border-b border-gray-700 pb-1 text-white">
              {user.department.replace('_', ' ')}
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-500 uppercase mb-1">Access Level</label>
          <div className={`inline-block px-3 py-1 text-xs uppercase font-bold border mt-2 ${
            user.isAdmin 
              ? 'border-green-500 text-green-400' 
              : 'border-blue-500 text-blue-400'
          }`}>
            {user.isAdmin ? 'SYSTEM ADMINISTRATOR' : 'VERIFIED VOTER'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;