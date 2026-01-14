import React, { useState } from 'react';
import { useApp } from '../store';
import Button from '../ui/Button';
import { useNavigate, Link  } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';


const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate(); 

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(id, password);

      if (success) {
        toast.success("IDENTITY VERIFIED"); 
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        if (user?.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error("ACCESS DENIED: INVALID CREDENTIALS");
        setPassword(''); 
      }
    } catch (err) {
      toast.error("SYSTEM ERROR: CONNECTION FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-10 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-sm tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="border-2 border-white p-12 bg-black">
          <h1 className="text-4xl font-bold uppercase text-center mb-10 tracking-tighter">
            AUTHENTICATION
          </h1>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 text-center uppercase text-sm font-bold mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              placeholder=" EMAIL"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none transition-colors"
              autoFocus
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-700 p-4 text-xl font-mono focus:border-white outline-none transition-colors"
            />

            <Button type="submit" className="w-full py-6 text-xl">
              Enter System <ArrowRight className="ml-3" />
            </Button>
          </form>

          {/* <p className="text-center mt-8 text-gray-500 text-sm uppercase tracking-widest">
            New user?{' '}
            <Link to="/signup" className="underline hover:text-white">
              Register here
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;