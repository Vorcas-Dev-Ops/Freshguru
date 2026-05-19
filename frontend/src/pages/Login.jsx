import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5055/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.admin);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Cannot connect to the server. Please ensure the backend is running.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3fcef] flex items-center justify-center p-4 font-inter relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={logo} alt="Fresh Guru" className="h-16 object-contain mb-2" />
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black mt-1">ADMIN PORTAL</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-semibold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-[#006e2f] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#006e2f]/5 focus:bg-white focus:border-[#006e2f] transition-all"
                  placeholder="admin@freshguru.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-[#006e2f] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#006e2f]/5 focus:bg-white focus:border-[#006e2f] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-[#006e2f] focus:ring-[#006e2f] transition-all cursor-pointer" />
                <span className="ml-2 text-[13px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-[13px] font-bold text-[#006e2f] hover:text-[#1a4d2e] transition-colors">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-[#006e2f] text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(0,110,47,0.2)] hover:shadow-[0_15px_25px_rgba(0,110,47,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          &copy; 2024 Fresh Guru. Built for premium logistics.
        </p>
      </div>
    </div>
  );
};

export default Login;
