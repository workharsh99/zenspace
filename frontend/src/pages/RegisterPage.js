import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/axios';
import toast from 'react-hot-toast';

const wellnessGoals = [
  'Reduce stress and anxiety',
  'Improve sleep quality',
  'Build mindfulness habit',
  'Increase energy levels',
  'Improve focus and productivity',
  'Emotional balance',
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', wellnessGoal: '', stressLevel: 'MODERATE',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!form.username || form.username.length < 3) {
      toast.error('Username must be at least 3 characters'); return false;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Please enter a valid email'); return false;
    }
    if (!form.password || form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const res = await userApi.post('/register', submitData);
      const { token, ...userData } = res.data;
      login(userData, token);
      toast.success('Welcome to ZenSpace! 🎉');
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach(msg => toast.error(msg));
      } else {
        toast.error(errorData?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-to-br from-slate-50 to-wellness-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-wellness-500 to-calm-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              🌿
            </div>
            <h1 className="text-2xl font-bold text-slate-800 font-display">Join ZenSpace</h1>
            <p className="text-slate-500 mt-1">Start your wellness journey today</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${s <= step ? 'text-wellness-600' : 'text-slate-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    s < step ? 'bg-wellness-500 text-white' :
                    s === step ? 'bg-wellness-100 text-wellness-700 border-2 border-wellness-400' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {s < step ? '✓' : s}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">
                    {s === 1 ? 'Account Info' : 'Wellness Goals'}
                  </span>
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-wellness-400' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                    placeholder="John" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                    placeholder="Doe" className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username *</label>
                <input type="text" name="username" value={form.username} onChange={handleChange}
                  placeholder="Choose a username" className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} placeholder="Min. 6 characters" className="input-field pr-12" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password *</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="Repeat your password" className="input-field" required />
              </div>

              <button type="button" onClick={handleNext} className="btn-primary w-full py-3.5 text-base mt-2">
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Wellness Goals */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  What's your main wellness goal?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {wellnessGoals.map(goal => (
                    <label key={goal} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form.wellnessGoal === goal
                        ? 'border-wellness-400 bg-wellness-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" name="wellnessGoal" value={goal}
                        checked={form.wellnessGoal === goal} onChange={handleChange}
                        className="text-wellness-500" />
                      <span className="text-sm text-slate-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current stress level
                </label>
                <select name="stressLevel" value={form.stressLevel} onChange={handleChange}
                  className="input-field">
                  <option value="LOW">😌 Low - Generally calm</option>
                  <option value="MODERATE">😐 Moderate - Some stress</option>
                  <option value="HIGH">😰 High - Frequently stressed</option>
                  <option value="VERY_HIGH">😫 Very High - Overwhelmed</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : '🌟 Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-wellness-600 font-semibold hover:text-wellness-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-slate-400 text-sm hover:text-slate-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
