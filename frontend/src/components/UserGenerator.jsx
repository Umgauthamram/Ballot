import React, { useState } from 'react';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';
import { useApp } from '../store';

const UserGenerator = () => {
    const { generateUsers } = useApp();
    const [genMode, setGenMode] = useState('SINGLE'); // SINGLE | BULK
    const [singleUser, setSingleUser] = useState({ name: '', email: '', studentId: '', department: 'GENERAL', collegeName: '' });
    const [bulkData, setBulkData] = useState('');
    const [genStatus, setGenStatus] = useState(null);

    const handleGenerateUsers = async (e) => {
        e.preventDefault();
        setGenStatus({ type: 'loading', msg: 'Generating credentials...' });

        let usersToGen = [];

        if (genMode === 'SINGLE') {
            usersToGen = [singleUser];
        } else {
            try {
                // Simple CSV parsing: name,email,studentId,department
                usersToGen = bulkData.trim().split('\n')
                    .filter(line => line.trim().length > 0)
                    .map(line => {
                        const parts = line.split(',').map(s => s.trim());
                        // Basic validation
                        if (parts.length < 4) throw new Error('Invalid format');

                        const [name, email, studentId, department, collegeName] = parts;
                        return { name, email, studentId, department: department || 'GENERAL', collegeName: collegeName || 'Unknown' };
                    });
            } catch (err) {
                setGenStatus({ type: 'error', msg: 'Invalid CSV Format. Use: Name, Email, StudentID, Department, College Name' });
                return;
            }
        }

        const result = await generateUsers(usersToGen);

        if (result.success) {
            setGenStatus({
                type: 'success',
                msg: `Processed. Success: ${result.results.success.length}, Failed: ${result.results.failed.length}`
            });
            if (genMode === 'SINGLE' && result.results.success.length > 0) {
                setSingleUser({ name: '', email: '', studentId: '', department: 'GENERAL', collegeName: '' });
            } else if (genMode === 'BULK') {
                setBulkData('');
            }
        } else {
            setGenStatus({ type: 'error', msg: result.message });
        }
    };

    return (
        <div className="border border-white/20 p-8 bg-black">
            <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-3">
                <Plus /> Generate User Credentials
            </h3>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setGenMode('SINGLE')}
                    className={`px-4 py-2 text-xs font-bold uppercase border ${genMode === 'SINGLE' ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-500'}`}
                >
                    Single Entry
                </button>
                <button
                    onClick={() => setGenMode('BULK')}
                    className={`px-4 py-2 text-xs font-bold uppercase border ${genMode === 'BULK' ? 'bg-white text-black border-white' : 'border-gray-600 text-gray-500'}`}
                >
                    Bulk CSV
                </button>
            </div>

            <form onSubmit={handleGenerateUsers} className="space-y-6">
                {genMode === 'SINGLE' ? (
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-white"
                            placeholder="Full Name"
                            required
                            value={singleUser.name}
                            onChange={e => setSingleUser({ ...singleUser, name: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-white"
                            placeholder="Email Address"
                            type="email"
                            required
                            value={singleUser.email}
                            onChange={e => setSingleUser({ ...singleUser, email: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-white"
                            placeholder="Student ID"
                            required
                            value={singleUser.studentId}
                            onChange={e => setSingleUser({ ...singleUser, studentId: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-white"
                            placeholder="Department"
                            required
                            value={singleUser.department}
                            onChange={e => setSingleUser({ ...singleUser, department: e.target.value })}
                        />
                        <input
                            className="bg-gray-900 border border-gray-700 p-3 text-white outline-none focus:border-white w-full col-span-2"
                            placeholder="College Name"
                            required
                            value={singleUser.collegeName}
                            onChange={e => setSingleUser({ ...singleUser, collegeName: e.target.value })}
                        />
                    </div>
                ) : (
                    <textarea
                        className="w-full h-40 bg-gray-900 border border-gray-700 p-4 text-white font-mono text-sm outline-none focus:border-white"
                        placeholder={`Format: Name, Email, StudentID, Department, College Name\nExample:\nJohn Doe, john@test.com, CS101, Computer Science, Tech Institute\nJane Smith, jane@test.com, ME102, Mechanical, Tech Institute`}
                        value={bulkData}
                        onChange={e => setBulkData(e.target.value)}
                    />
                )}

                {genStatus && (
                    <div className={`p-4 text-sm font-bold uppercase ${genStatus.type === 'error' ? 'bg-red-900/30 text-red-500' : genStatus.type === 'success' ? 'bg-green-900/30 text-green-500' : 'text-gray-400'}`}>
                        {genStatus.msg}
                    </div>
                )}

                <Button type="submit" disabled={genStatus?.type === 'loading'} className="w-full">
                    {genStatus?.type === 'loading' ? 'Generating...' : 'Generate and Send Credentials'}
                </Button>
            </form>
        </div>
    );
};

export default UserGenerator;
