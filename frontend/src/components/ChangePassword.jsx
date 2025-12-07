
import React, { useState } from 'react';
import  Button from '../ui/Button';

const ChangePassword = ({ onChangePassword }) => {
  const [form, setForm] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.new !== form.confirm) {
      setMessage({ type: 'error', text: 'NEW PASSWORDS DO NOT MATCH' });
      return;
    }

    if (form.new.length < 4) {
      setMessage({ type: 'error', text: 'PASSWORD TOO SHORT' });
      return;
    }

    const success = onChangePassword(form.old, form.new);

    if (success) {
      setMessage({ type: 'success', text: 'PASSWORD PROTOCOL UPDATED' });
      setForm({ old: '', new: '', confirm: '' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: 'INCORRECT CURRENT PASSWORD' });
    }
  };

  return (
    <div className="border border-white/20 p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="border-2 border-white text-white w-12 h-12 flex items-center justify-center text-xl font-bold">
          [LOCK]
        </div>
        <div>
          <h2 className="text-xl font-bold uppercase">Security Protocol</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Update Access Credentials</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 text-center text-xs uppercase font-bold border ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-500 text-green-400' 
            : 'bg-red-900/30 border-red-500 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-gray-500 uppercase mb-2">Current Password</label>
          <input
            type="password"
            required
            value={form.old}
            onChange={(e) => setForm({ ...form, old: e.target.value })}
            className="w-full bg-black border border-gray-700 p-3 text-white focus:border-white outline-none font-mono"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase mb-2">New Password</label>
          <input
            type="password"
            required
            value={form.new}
            onChange={(e) => setForm({ ...form, new: e.target.value })}
            className="w-full bg-black border border-gray-700 p-3 text-white focus:border-white outline-none font-mono"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase mb-2">Confirm New Password</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full bg-black border border-gray-700 p-3 text-white focus:border-white outline-none font-mono"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-6">
          <Button type="submit" className="w-full text-lg py-4">
            Update Security Protocol
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;