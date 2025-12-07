import React, { useState } from 'react';
import { useApp } from '../store';
import Layout from '../Layout/layout'; 
import Button from '../ui/Button';
import AuditLog from '../components/AuditLog';
import {
  Check,
  X,
  UserCheck,
  BarChart3,
  List,
  Users,
  Play,
  StopCircle,
  Plus,
  ArrowLeft,
  Crown,
  Mail,
  CreditCard,
  Building,
  Hash
} from 'lucide-react';

const AdminPanel = () => {
  const { users, verifyUser, transactions, polls, createPoll, togglePollStatus } = useApp();
  const [activeTab, setActiveTab] = useState('POLLS');
  const [selectedIdImage, setSelectedIdImage] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);

  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    eligibility: 'ALL',
    candidatesStr: ''
  });

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; 
    const cleanPath = path.replace(/\\/g, '/');
    const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `http://localhost:5000${formattedPath}`; 
  };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const studentCount = users.filter(u => !u.isAdmin).length;

  const handleCreatePoll = (e) => {
    e.preventDefault();
    const candidates = newPoll.candidatesStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (candidates.length < 2) {
      alert('Please enter at least 2 candidates');
      return;
    }

    createPoll({
      title: newPoll.title,
      description: newPoll.description,
      eligibility: newPoll.eligibility,
      candidates
    });

    setIsCreatingPoll(false);
    setNewPoll({ title: '', description: '', eligibility: 'ALL', candidatesStr: '' });
  };

  const getWinner = (poll) => {
    if (!poll.candidates || poll.candidates.length === 0) return null;
    return poll.candidates.reduce((prev, current) => 
      (prev.voteCount > current.voteCount) ? prev : current
    , poll.candidates[0]);
  };

  const getTotalVotes = (poll) => {
    return poll.candidates.reduce((acc, c) => acc + c.voteCount, 0);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen">
  
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* NAVBAR */}
          <div className="flex border-b border-white/20 overflow-x-auto bg-black/50">
            <button
              onClick={() => setActiveTab('POLLS')}
              className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${
                activeTab === 'POLLS' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              <BarChart3 size={18} /> Poll Manager
            </button>
            <button
              onClick={() => setActiveTab('VERIFY')}
              className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${
                activeTab === 'VERIFY' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              <UserCheck size={18} /> Verification ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('STUDENTS')}
              className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${
                activeTab === 'STUDENTS' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Users size={18} /> Registry
            </button>
          </div>

          <div className="flex-grow overflow-y-auto border border-white/20 bg-gray-900/20 p-6">

            {/* --- POLL MANAGER TAB --- */}
            {activeTab === 'POLLS' && (
              <div className="space-y-10">
                {isCreatingPoll ? (
                  <div className="border-2 border-white/60 p-10 bg-black/60">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-3xl font-bold uppercase">New Election Protocol</h3>
                      <Button variant="ghost" onClick={() => setIsCreatingPoll(false)}>
                        <ArrowLeft size={20} /> Cancel
                      </Button>
                    </div>

                    <form onSubmit={handleCreatePoll} className="space-y-8">
                      <input
                        type="text"
                        placeholder="ELECTION TITLE"
                        required
                        value={newPoll.title}
                        onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                        className="w-full bg-transparent border-b-2 border-white/70 p-4 text-2xl font-bold uppercase focus:border-white outline-none"
                      />
                      <textarea
                        placeholder="Election description..."
                        required
                        rows={4}
                        value={newPoll.description}
                        onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                        className="w-full bg-gray-900/50 border border-gray-700 p-6 text-base resize-none focus:border-white outline-none"
                      />

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-sm uppercase text-gray-500 mb-3 block">Target Population</label>
                          <select
                            value={newPoll.eligibility}
                            onChange={(e) => setNewPoll({ ...newPoll, eligibility: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 p-5 text-lg uppercase focus:border-white outline-none"
                          >
                            <option value="ALL">All Students</option>
                            <option value="COMPUTER_SCIENCE">Computer Science</option>
                            <option value="ENGINEERING">Engineering</option>
                            <option value="ARTS">Arts</option>
                            <option value="BUSINESS">Business</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm uppercase text-gray-500 mb-3 block">Candidates (comma separated)</label>
                          <input
                            type="text"
                            placeholder="Alice Kim, Bob Chen, Charlie Park"
                            required
                            value={newPoll.candidatesStr}
                            onChange={(e) => setNewPoll({ ...newPoll, candidatesStr: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 p-5 text-lg focus:border-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" className="px-16 py-5 text-2xl">
                          Launch Election
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-3xl font-bold uppercase">Active Protocols</h3>
                    <Button onClick={() => setIsCreatingPoll(true)} className="px-8 py-4 text-xl">
                      <Plus size={24} className="mr-3" /> New Election
                    </Button>
                  </div>
                )}

                <div className="space-y-8">
                  {polls.length === 0 ? (
                    <div className="text-center py-32 text-gray-600 uppercase tracking-widest text-2xl">
                      No elections created yet
                    </div>
                  ) : (
                    polls.map(poll => {
                      const totalVotes = getTotalVotes(poll);
                      const winner = getWinner(poll);
                      const winnerId = winner ? (winner._id || winner.id) : null;

                      return (
                        <div key={poll.id} className="border border-white/40 p-8 hover:border-white transition-all bg-black/40">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <h4 className="text-2xl font-bold uppercase">{poll.title}</h4>
                              <div className="text-sm text-gray-500 uppercase mt-3 space-x-4">
                                <span>{poll.id}</span>
                                <span>•</span>
                                <span>{poll.eligibility === 'ALL' ? 'All Depts' : poll.eligibility.replace('_', ' ')}</span>
                                <span>•</span>
                                <span className={poll.status === 'ACTIVE' ? 'text-green-400' : poll.status === 'ENDED' ? 'text-red-400' : 'text-yellow-400'}>
                                  {poll.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              {poll.status === 'UPCOMING' && (
                                <Button onClick={() => togglePollStatus(poll.id, 'ACTIVE')} className="px-8 py-3 text-lg">
                                  <Play size={18} className="mr-2" /> Start
                                </Button>
                              )}
                              {poll.status === 'ACTIVE' && (
                                <Button onClick={() => togglePollStatus(poll.id, 'ENDED')} variant="secondary" className="px-8 py-3 text-lg">
                                  <StopCircle size={18} className="mr-2" /> End
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-5">
                            {poll.candidates.map(c => {
                              const pct = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
                              const cId = c._id || c.id;
                              const isWinner = poll.status === 'ENDED' && cId === winnerId && totalVotes > 0;

                              return (
                                <div key={cId} className="flex flex-col gap-2">
                                  <div className="flex justify-between items-center text-base">
                                    <div className="flex items-center gap-2">
                                      {isWinner && <Crown size={20} className="text-yellow-400 fill-yellow-400 animate-pulse" />}
                                      <span className={`w-40 truncate font-medium ${isWinner ? 'text-yellow-400 font-bold' : ''}`}>
                                        {c.name}
                                      </span>
                                    </div>
                                    <span className="font-mono font-bold">{c.voteCount} ({pct}%)</span>
                                  </div>
                                  
                                  <div className="w-full h-4 bg-gray-800 relative overflow-hidden">
                                    <div
                                      className={`absolute inset-0 transition-all duration-1000 ${
                                        isWinner 
                                          ? 'bg-yellow-400'
                                          : 'bg-gradient-to-r from-green-500 to-green-400'
                                      }`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {poll.status === 'ENDED' && winner && (
                            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                              <p className="text-sm text-gray-500 uppercase tracking-widest">
                                Official Winner: <span className="text-yellow-400 font-bold text-lg">{winner.name}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* --- VERIFICATION TAB --- */}
            {activeTab === 'VERIFY' && (
              <div className="space-y-6">
                {pendingUsers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 py-32">
                    <Check className="w-24 h-24 mb-8 opacity-30" />
                    <p className="text-3xl uppercase tracking-widest font-bold">Queue Empty</p>
                    <p className="text-sm mt-4">All submissions processed</p>
                  </div>
                ) : (
                  pendingUsers.map(user => (
                    <div
                      key={user.id}
                      className="border border-gray-700 bg-black p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white transition-all"
                    >
                      <div className="flex items-center gap-8">
                        <div
                          className="w-24 h-24 bg-gray-800 border-2 border-gray-600 cursor-zoom-in overflow-hidden group relative"
                       onClick={() => setSelectedIdImage(getFullImageUrl(user.idImageUrl))}
                        >
                          {user.idImageUrl ? (
                            <img src={getFullImageUrl(user.idImageUrl)} alt="ID" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              <List size={28} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold uppercase">{user.name}</div>
                          <div className="text-sm text-gray-400 font-mono mt-2">
                            {user.studentId} • {user.department.replace('_', ' ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-6">
                        <Button
                          variant="secondary"
                          onClick={() => verifyUser(user.id, false)}
                          className="px-10 py-3 text-lg"
                        >
                          <X size={18} className="mr-2" /> Reject
                        </Button>
                        <Button
                          onClick={() => verifyUser(user.id, true)}
                          className="px-10 py-3 text-lg bg-green-900 hover:bg-green-800 border-green-700"
                        >
                          <Check size={18} className="mr-2" /> Approve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- REGISTRY TAB (WITH CLICKABLE ROWS) --- */}
            {activeTab === 'STUDENTS' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base border-collapse">
                  <thead className="bg-gray-900 border-b-4 border-white/30">
                    <tr>
                      <th className="p-6 uppercase text-sm text-gray-400">Name</th>
                      <th className="p-6 uppercase text-sm text-gray-400">Student ID</th>
                      <th className="p-6 uppercase text-sm text-gray-400">Department</th>
                      <th className="p-6 uppercase text-sm text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {users
                      .filter(u => !u.isAdmin)
                      .map(u => (
                        <tr 
                          key={u.id} 
                          onClick={() => setViewStudent(u)}
                          className="hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <td className="p-6 font-bold uppercase text-lg">{u.name}</td>
                          <td className="p-6 font-mono text-gray-300">{u.studentId}</td>
                          <td className="p-6 text-sm uppercase">{u.department.replace('_', ' ')}</td>
                          <td className="p-6">
                            <span
                              className={`inline-block px-4 py-1 text-sm uppercase font-bold border ${
                                u.status === 'verified'
                                  ? 'border-green-500 text-green-400'
                                  : u.status === 'pending'
                                  ? 'border-yellow-500 text-yellow-400'
                                  : 'border-red-500 text-red-400'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="border-2 border-white/40 p-10 text-center bg-black/60">
            <h3 className="text-sm uppercase text-gray-500 tracking-widest mb-4">Registered Population</h3>
            <p className="text-7xl font-bold text-green-400">{studentCount}</p>
            <p className="text-sm text-gray-500 mt-4 uppercase tracking-widest">Verified Citizens</p>
          </div>

          <div className="flex-grow border-2 border-white/20 bg-black/40">
            <AuditLog transactions={transactions} />
          </div>
        </div>

        {/* --- STUDENT OVERVIEW CARD MODAL --- */}
        {viewStudent && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setViewStudent(null)}
          >
            {/* Prevent click inside modal from closing it */}
            <div 
              className="bg-black border-2 border-white w-full max-w-lg p-0 relative shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()} 
            >
              {/* Header */}
              <div className="bg-white text-black p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold uppercase tracking-tighter">{viewStudent.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase border border-black ${
                      viewStudent.status === 'verified' ? 'bg-green-400' : 'bg-red-400'
                    }`}>
                      {viewStudent.status}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest">
                      Registered Student
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewStudent(null)}
                  className="p-2 hover:bg-black hover:text-white transition-colors border border-black"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 grid gap-8">
                {/* ID Card Image */}
                <div className="w-full aspect-video bg-gray-900 border border-gray-700 flex items-center justify-center overflow-hidden">
                  {viewStudent.idImageUrl ? (
                     <img 
                       src={getFullImageUrl(viewStudent.idImageUrl)} 
                       alt="Student ID" 
                       className="w-full h-full object-contain"
                     />
                  ) : (
                    <div className="text-gray-600 uppercase text-sm font-bold flex flex-col items-center gap-2">
                       <CreditCard size={32} />
                       No ID Document
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-4 border-b border-gray-800 pb-2">
                    <Hash size={16} className="text-gray-500" />
                    <span className="text-gray-400 uppercase w-24">Student ID</span>
                    <span className="text-white font-bold">{viewStudent.studentId}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 border-b border-gray-800 pb-2">
                    <Building size={16} className="text-gray-500" />
                    <span className="text-gray-400 uppercase w-24">Department</span>
                    <span className="text-white">{viewStudent.department.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-4 border-b border-gray-800 pb-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-gray-400 uppercase w-24">Email</span>
                    <span className="text-white">{viewStudent.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing ID Modal (Keep if needed for verification tab zooming) */}
        {selectedIdImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-10 cursor-zoom-out"
            onClick={() => setSelectedIdImage(null)}
          >
            <img
              src={selectedIdImage}
              alt="Student ID"
              className="max-w-full max-h-full border-8 border-white shadow-2xl"
            />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminPanel;