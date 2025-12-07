import React, { useState } from 'react';
import { useApp } from '../store';
import  Button  from '../ui/button';
import  LoadingOverlay  from '../Layout/LoadingOverlay';
import {
  AlertTriangle,
  Upload,
  FileText,
  Vote,
  Clock,
  CheckCircle,
  Calendar,
  History,
  ArrowLeft
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

  const eligiblePolls = polls.filter(poll =>
    (poll.eligibility === 'ALL' || poll.eligibility === currentUser.department) &&
    !currentUser.votedPollIds.includes(poll.id)
  );

  const activePolls = eligiblePolls.filter(p => p.status === 'ACTIVE');
  const upcomingPolls = eligiblePolls.filter(p => p.status === 'UPCOMING');
  const myHistory = voteHistory.filter(h => currentUser.votedPollIds.includes(h.pollId));

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
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${
            activeTab === 'ACTIVE' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Vote size={18} /> Active ({activePolls.length})
        </button>
        <button
          onClick={() => { setActiveTab('UPCOMING'); setSelectedPoll(null); }}
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${
            activeTab === 'UPCOMING' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Calendar size={18} /> Upcoming ({upcomingPolls.length})
        </button>
        <button
          onClick={() => { setActiveTab('HISTORY'); setSelectedPoll(null); }}
          className={`px-8 py-5 text-sm font-bold uppercase flex items-center gap-3 whitespace-nowrap transition-all ${
            activeTab === 'HISTORY' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
          }`}
        >
          <History size={18} /> History
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">

        {/* Active Polls Grid */}
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

        {/* Voting Booth */}
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
              {selectedPoll.candidates.map(candidate => (
                <div
                  key={candidate.id}
                  onClick={() => setConfirmCandidate(candidate.id)}
                  className={`border-2 p-10 cursor-pointer transition-all duration-300 ${
                    confirmCandidate === candidate.id
                      ? 'bg-white text-black border-white'
                      : 'border-gray-700 hover:border-white bg-black'
                  }`}
                >
                  <h3 className="text-2xl font-bold uppercase mb-6">
                    {candidate.name}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-10 ${
                    confirmCandidate === candidate.id ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    "{candidate.manifesto}"
                  </p>
                  <div className="flex justify-end">
                    <div className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${
                      confirmCandidate === candidate.id
                        ? 'border-black bg-black'
                        : 'border-gray-600'
                    }`}>
                      {confirmCandidate === candidate.id && (
                        <div className="w-4 h-4 bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
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

        {/* Upcoming */}
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

        {/* Vote History */}
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