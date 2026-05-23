import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.usernameOrEmail || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await userApi.post('/login', form);
      const { token, ...userData } = res.data;
      login(userData, token);
      toast.success(res.data.message || 'Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-br from-slate-50 to-wellness-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-wellness-500 to-calm-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              🧘
            </div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">Welcome Back</h1>
            <p className="text-slate-500 mt-1">Sign in to continue your wellness journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className="input-field"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-wellness-50 rounded-xl border border-wellness-100">
            <p className="text-xs text-wellness-700 font-medium mb-1">Demo Account:</p>
            <p className="text-xs text-wellness-600">Username: <code className="bg-white px-1 rounded">demo</code> | Password: <code className="bg-white px-1 rounded">demo123</code></p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-wellness-600 font-semibold hover:text-wellness-700 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-slate-400 text-sm hover:text-slate-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
