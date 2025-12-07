import React, { useState } from 'react';
import { useApp } from '../store';
import Button from '../ui/Button';
import LoadingOverlay from '../Layout/LoadingOverlay';
import {
  AlertTriangle,
  Upload,
  FileText,
  Vote,
  Clock,
  CheckCircle,
  Calendar,
  History,
  ArrowLeft,
  Trophy,
  Crown
} from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser, polls, castVote, uploadId, voteHistory } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [confirmCandidate, setConfirmCandidate] = useState(null);

  if (!currentUser) return null;

  // Filter Logic
  const eligiblePolls = polls.filter(poll =>
    (poll.eligibility === 'ALL' || poll.eligibility === currentUser.department) &&
    !currentUser.votedPollIds.includes(poll.id)
  );

  const activePolls = eligiblePolls.filter(p => p.status === 'ACTIVE');
  const upcomingPolls = eligiblePolls.filter(p => p.status === 'UPCOMING');
  
  const endedPolls = polls.filter(p => p.status === 'ENDED' && 
    (p.eligibility === 'ALL' || p.eligibility === currentUser.department)
  );

  const myHistory = voteHistory.filter(h => currentUser.votedPollIds.includes(h.pollId));

  // Helper: Calculate Total Votes
  const getTotalVotes = (poll) => {
    return poll.candidates.reduce((acc, c) => acc + c.voteCount, 0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    await uploadId(selectedFile);
    setIsUploading(false);
    setSelectedFile(null);
  };

  const handleVote = async () => {
    if (!selectedPoll || !confirmCandidate) return;
    setIsVoting(true);
    await castVote(selectedPoll.id, confirmCandidate);
    setIsVoting(false);
    setSelectedPoll(null);
    setConfirmCandidate(null);
    setActiveTab('HISTORY');
  };

  // 1. Unverified State
  if (currentUser.status === 'unverified') {
    return (
      <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-700">
        <div className="border border-white p-8 bg-gray-900/40">
          <div className="flex items-start gap-5">
            <div className="bg-white text-black p-4 flex-shrink-0">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-3">Identity Verification Required</h2>
              <p className="text-gray-400 leading-relaxed">
                Your account requires manual verification before accessing the ballot.
                <br />Please upload a clear photo of your official Student ID Card.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-white/20 p-10">
          <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3">
            <Upload className="w-6 h-6" /> Upload Student ID
          </h3>

          <form onSubmit={handleUpload} className="space-y-8">
            <div className="border-2 border-dashed border-gray-700 hover:border-white transition-all duration-300 p-16 text-center cursor-pointer group relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="w-16 h-16 mx-auto mb-6 text-gray-500 group-hover:text-white transition-colors" />
              <p className="uppercase font-bold tracking-widest text-sm group-hover:text-white transition-colors">
                {selectedFile ? selectedFile.name : "Drop ID Card Here or Click to Select"}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!selectedFile || isUploading}
                isLoading={isUploading}
                className="px-10"
              >
                Submit for Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Pending Verification
  if (currentUser.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto text-center mt-20 animate-in fade-in duration-1000">
        <Clock className="w-24 h-24 mx-auto mb-8 text-gray-500 animate-pulse" />
        <h2 className="text-3xl font-bold uppercase mb-6">Verification in Progress</h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          Your ID has been submitted.<br />
          Please allow up to 24 hours for administrative review.
        </p>
        <div className="inline-block bg-gray-900 px-8 py-4 border border-gray-700 text-sm uppercase tracking-widest font-mono">
          Status: AWAITING APPROVAL
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {isVoting && <LoadingOverlay message="SUBMITTING VOTE TO BLOCKCHAIN..." />}

      {/* Tabs */}
      <div className="flex border-b border-white/20 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => { setActiveTab('ACTIVE'); setSelectedPoll(null); }}
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${activeTab === 'ACTIVE' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <Vote size={18} /> Active ({activePolls.length})
        </button>
        <button
          onClick={() => { setActiveTab('UPCOMING'); setSelectedPoll(null); }}
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${activeTab === 'UPCOMING' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <Calendar size={18} /> Upcoming ({upcomingPolls.length})
        </button>
        <button
          onClick={() => { setActiveTab('RESULTS'); setSelectedPoll(null); }}
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${activeTab === 'RESULTS' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <Trophy size={18} /> Results ({endedPolls.length})
        </button>
        <button
          onClick={() => { setActiveTab('HISTORY'); setSelectedPoll(null); }}
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${activeTab === 'HISTORY' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
        >
          <History size={18} /> History
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">

        {/* 1. Active Polls List */}
        {activeTab === 'ACTIVE' && !selectedPoll && (
          activePolls.length === 0 ? (
            <div className="text-center py-32 text-gray-500 uppercase tracking-widest">
              No active elections available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePolls.map(poll => (
                <div
                  key={poll.id}
                  className="border border-gray-700 hover:border-white transition-all duration-300 p-8 bg-black/40 cursor-pointer group"
                  onClick={() => setSelectedPoll(poll)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-green-900/50 text-green-400 text-xs px-3 py-1 uppercase font-bold border border-green-800">
                      Live
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                      {poll.eligibility === 'ALL' ? 'All Students' : poll.eligibility.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-4 leading-tight">
                    {poll.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-8 line-clamp-3">
                    {poll.description}
                  </p>
                  <Button className="w-full group-hover:bg-white group-hover:text-black transition-all">
                    Enter Voting Booth
                  </Button>
                </div>
              ))}
            </div>
          )
        )}

        {/* 2. Voting Booth (Active) */}
        {selectedPoll && (
          <div>
            <button
              onClick={() => { setSelectedPoll(null); setConfirmCandidate(null); }}
              className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-sm font-bold"
            >
              <ArrowLeft size={16} /> Back to Elections
            </button>

            <h2 className="text-3xl font-bold uppercase mb-10 text-center">
              {selectedPoll.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {selectedPoll.candidates.map(candidate => {
                const cId = candidate._id || candidate.id;
                const isSelected = confirmCandidate === cId;
                
                const totalVotes = getTotalVotes(selectedPoll);
                const percentage = totalVotes === 0 ? 0 : Math.round((candidate.voteCount / totalVotes) * 100);

                return (
                  <div
                    key={cId}
                    onClick={() => setConfirmCandidate(cId)}
                    className={`border-2 p-10 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${isSelected
                        ? 'bg-white text-black border-white'
                        : 'border-gray-700 hover:border-white bg-black'
                      }`}
                  >
                    <div>
                      <h3 className="text-2xl font-bold uppercase mb-6 relative z-10">
                        {candidate.name}
                      </h3>
                      <p className={`text-sm leading-relaxed mb-6 relative z-10 ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                        "{candidate.manifesto}"
                      </p>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-end">
                        <span className={`text-xs font-bold font-mono ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                          LIVE TRACKING
                        </span>
                        <div className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${isSelected ? 'border-black bg-black' : 'border-gray-600'}`}>
                          {isSelected && <div className="w-4 h-4 bg-white" />}
                        </div>
                      </div>

                      {/* WHITE STATUS BAR */}
                      <div className="w-full h-4 bg-gray-800 border border-gray-600">
                        <div 
                          className={`h-full transition-all duration-1000 ${isSelected ? 'bg-black' : 'bg-white'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className={`text-right font-mono text-xs ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                        {candidate.voteCount} VOTES ({percentage}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                disabled={!confirmCandidate}
                onClick={handleVote}
                className="px-20 text-lg"
              >
                Cast Immutable Vote
              </Button>
            </div>
          </div>
        )}

        {/* 3. Upcoming */}
        {activeTab === 'UPCOMING' && (
          upcomingPolls.length === 0 ? (
            <div className="text-center py-32 text-gray-600 uppercase tracking-widest">
              No upcoming elections scheduled
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80">
              {upcomingPolls.map(poll => (
                <div key={poll.id} className="border border-gray-800 p-8">
                  <span className="text-xs uppercase text-gray-500 mb-4 block">Coming Soon</span>
                  <h3 className="text-xl font-bold uppercase mb-3 text-gray-300">
                    {poll.title}
                  </h3>
                  <p className="text-sm text-gray-500">{poll.description}</p>
                </div>
              ))}
            </div>
          )
        )}

        {/* 4. RESULTS (ENDED POLLS) - FIXED CROWN LOGIC */}
        {activeTab === 'RESULTS' && (
          endedPolls.length === 0 ? (
            <div className="text-center py-32 text-gray-600 uppercase tracking-widest">
              No elections have ended yet
            </div>
          ) : (
            <div className="space-y-12">
              {endedPolls.map(poll => {
                const totalVotes = getTotalVotes(poll);
                
                // Determine Winner Object
                const winner = poll.candidates.reduce((prev, current) => 
                  (prev.voteCount > current.voteCount) ? prev : current
                , poll.candidates[0]);

                // Normalize Winner ID for comparison
                const winnerId = winner._id || winner.id;

                return (
                  <div key={poll.id} className="border border-white/20 p-8 bg-black/40">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                      <h3 className="text-3xl font-bold uppercase">{poll.title}</h3>
                      <span className="bg-red-900/50 text-red-400 text-xs px-4 py-2 uppercase font-bold border border-red-800">
                        Election Ended
                      </span>
                    </div>

                    <div className="space-y-6">
                      {poll.candidates.map(candidate => {
                        // Normalize Candidate ID
                        const cId = candidate._id || candidate.id;
                        
                        // STRICT COMPARISON
                        const isWinner = cId === winnerId && totalVotes > 0; // Check totalVotes to avoid crown on 0-0 ties if preferred
                        const percentage = totalVotes === 0 ? 0 : Math.round((candidate.voteCount / totalVotes) * 100);

                        return (
                          <div key={cId} className="group">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-3">
                                <span className={`text-xl font-bold uppercase ${isWinner ? 'text-yellow-400' : 'text-white'}`}>
                                  {candidate.name}
                                </span>
                                {isWinner && (
                                  <Crown className="text-yellow-400 fill-yellow-400 animate-pulse" size={24} />
                                )}
                              </div>
                              <span className="font-mono text-gray-400">
                                {candidate.voteCount} Votes ({percentage}%)
                              </span>
                            </div>

                            {/* Result Bar */}
                            <div className="w-full h-6 bg-gray-900 border border-gray-700 relative">
                              <div 
                                className={`h-full transition-all duration-1000 ${isWinner ? 'bg-yellow-400' : 'bg-white'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                      <p className="text-sm text-gray-500 uppercase tracking-widest">
                        Winner Declared: <span className="text-white font-bold">{winner.name}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'HISTORY' && (
          <div className="border border-white/20 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-900 border-b border-white/20">
                <tr>
                  <th className="p-5 uppercase text-xs text-gray-400">Election</th>
                  <th className="p-5 uppercase text-xs text-gray-400">Your Vote</th>
                  <th className="p-5 uppercase text-xs text-gray-400">Time Cast</th>
                  <th className="p-5 uppercase text-xs text-gray-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {myHistory.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-gray-600 italic">
                      No votes recorded yet.
                    </td>
                  </tr>
                ) : (
                  myHistory.map((record, i) => (
                    <tr key={i} className="hover:bg-gray-900/30 transition-colors">
                      <td className="p-5 font-bold uppercase">{record.pollTitle}</td>
                      <td className="p-5">{record.candidateName}</td>
                      <td className="p-5 font-mono text-sm text-gray-500">{record.timestamp}</td>
                      <td className="p-5 text-right">
                        <span className="inline-flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
                          <CheckCircle size={14} /> Confirmed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;