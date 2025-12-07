import React, { useState } from 'react';
import { useApp } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../ui/button';
import { ChevronLeft } from 'lucide-react';

const departments = ['GENERAL', 'COMPUTER_SCIENCE', 'ENGINEERING', 'ARTS', 'BUSINESS'];

const Signup = () => {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    studentId: '',
    email: '',
    department: 'GENERAL',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setError('PASSWORDS DO NOT MATCH');
      return;
    }
    if (!form.name || !form.studentId || !form.email || !form.password) {
      setError('ALL FIELDS REQUIRED');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // CORRECT WAY: Pass individual fields
      signup({
        name: form.name,
        studentId: form.studentId,
        email: form.email,
        department: form.department,
        password: form.password
      });

      // Success → Show message + redirect
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError('REGISTRATION FAILED • TRY AGAIN');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="mb-10 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-sm tracking-widest font-bold"
        >
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="border-2 border-white p-12 bg-black">
          <h1 className="text-4xl font-bold uppercase text-center mb-10 tracking-tighter">
            STUDENT REGISTRATION
          </h1>

          {/* Success State */}
          {isSubmitting && !error && (
            <div className="bg-green-900/40 border border-green-500 text-green-400 p-6 text-center uppercase text-lg font-bold mb-8 animate-pulse">
              DIGITAL IDENTITY CREATED • REDIRECTING...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 text-center uppercase text-sm font-bold mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              placeholder="FULL NAME"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none"
              disabled={isSubmitting}
            />

            <div className="grid md:grid-cols-2 gap-8">
              <input
                type="text"
                placeholder="STUDENT ID"
                required
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none"
                disabled={isSubmitting}
              />
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none"
                disabled={isSubmitting}
              >
                {departments.map(d => (
                  <option key={d} value={d} className="bg-black">
                    {d.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none"
              disabled={isSubmitting}
            />

            <div className="grid md:grid-cols-2 gap-8">
              <input
                type="password"
                placeholder="PASSWORD"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none"
                disabled={isSubmitting}
              />
              <input
                type="password"
                placeholder="CONFIRM PASSWORD"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none"
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full py-6 text-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'CREATING IDENTITY...' : 'Create Digital Identity'}
            </Button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-sm uppercase tracking-widest">
            Already registered?{' '}
            <Link to="/login" className="underline hover:text-white">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;