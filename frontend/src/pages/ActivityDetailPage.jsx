import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { activityApi, sessionApi } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import BreathingExercise from '../components/BreathingExercise.jsx';
import MoodTracker from '../components/MoodTracker.jsx';
import toast from 'react-hot-toast';

const categoryConfig = {
  MEDITATION: { emoji: '🧘', gradient: 'from-purple-500 to-indigo-600' },
  BREATHING:  { emoji: '💨', gradient: 'from-blue-500 to-cyan-600' },
  YOGA:       { emoji: '🌿', gradient: 'from-green-500 to-teal-600' },
  MUSIC:      { emoji: '🎵', gradient: 'from-pink-500 to-rose-600' },
  MOTIVATION: { emoji: '⭐', gradient: 'from-orange-500 to-amber-600' },
};

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');
  const [sessionTimer, setSessionTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    activityApi.get(`/${id}`)
      .then(res => setActivity(res.data))
      .catch(() => { toast.error('Activity not found'); navigate('/activities'); })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated()) {
      sessionApi.get(`/favorites/check/${id}`).then(res => setIsFavorite(res.data.isFavorite)).catch(() => {});
    }
  }, [id]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleStartSession = async () => {
    if (!isAuthenticated()) { toast.error('Please login to track sessions'); navigate('/login'); return; }
    try {
      const res = await sessionApi.post('/start', {
        activityId: activity.id, activityTitle: activity.title,
        activityCategory: activity.category, durationMinutes: activity.durationMinutes,
        moodBefore, stressLevelBefore: 5,
      });
      setCurrentSession(res.data);
      setSessionStarted(true);
      setSessionTimer(0);
      timerRef.current = setInterval(() => setSessionTimer(p => p + 1), 1000);
      toast.success('Session started! Enjoy your practice 🧘');
    } catch { toast.error('Failed to start session'); }
  };

  const handleCompleteSession = async () => {
    if (!currentSession) return;
    clearInterval(timerRef.current);
    try {
      await sessionApi.put(`/${currentSession.id}/complete`, {
        moodAfter, stressLevelAfter: 3, actualDurationMinutes: Math.floor(sessionTimer / 60), rating: 5,
      });
      await activityApi.post(`/${id}/complete`);
      setSessionStarted(false);
      setCurrentSession(null);
      toast.success('Session completed! Great work! 🎉');
    } catch { toast.error('Failed to complete session'); }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated()) { toast.error('Please login to save favorites'); navigate('/login'); return; }
    try {
      if (isFavorite) {
        await sessionApi.delete(`/favorites/${id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await sessionApi.post('/favorites', {
          activityId: activity.id, activityTitle: activity.title,
          activityCategory: activity.category, activityImageUrl: activity.imageUrl,
        });
        setIsFavorite(true);
        toast.success('Added to favorites ❤️');
      }
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update favorites'); }
  };

  const formatTime = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-wellness-200 border-t-wellness-500 rounded-full animate-spin" />
    </div>
  );
  if (!activity) return null;

  const config = categoryConfig[activity.category] || categoryConfig.MEDITATION;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="relative h-72 overflow-hidden">
        {activity.imageUrl ? (
          <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <span className="text-8xl">{config.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/activities" className="text-white/70 text-sm hover:text-white mb-2 inline-block">← Back to Activities</Link>
            <h1 className="text-3xl font-bold text-white font-display">{activity.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`badge bg-gradient-to-r ${config.gradient} text-white`}>{config.emoji} {activity.category}</span>
                <span className="badge bg-slate-100 text-slate-700">⏱️ {activity.durationMinutes} min</span>
                <span className="badge bg-slate-100 text-slate-700">📊 {activity.difficulty || 'BEGINNER'}</span>
                <span className="badge bg-yellow-100 text-yellow-700">★ {activity.rating?.toFixed(1)} ({activity.totalRatings})</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{activity.description}</p>
            </div>

            {activity.benefits?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-800 text-lg mb-4">✨ Benefits</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activity.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                      <span className="w-5 h-5 bg-wellness-100 text-wellness-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activity.instructions?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-800 text-lg mb-4">📋 How to Practice</h2>
                <ol className="space-y-3">
                  {activity.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 text-sm">
                      <span className="w-6 h-6 bg-wellness-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activity.category === 'BREATHING' && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-800 text-lg mb-2">🌬️ Interactive Breathing Guide</h2>
                <p className="text-slate-500 text-sm mb-4">Follow the animated guide for the perfect breathing rhythm</p>
                <BreathingExercise pattern={activity.breathingPattern || { inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 4, cycles: 8 }} />
              </div>
            )}

            {activity.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activity.tags.map(tag => (
                  <span key={tag} className="text-sm bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-slate-800 mb-4">Start a Session</h3>
              {!sessionStarted ? (
                <>
                  <MoodTracker onMoodSelect={setMoodBefore} label="How are you feeling now?" />
                  <button onClick={handleStartSession} className="btn-primary w-full mt-4">▶ Start Session</button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-wellness-400 to-calm-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white text-xl font-bold font-mono">{formatTime(sessionTimer)}</span>
                  </div>
                  <p className="text-wellness-600 font-medium">Session in progress...</p>
                  <MoodTracker onMoodSelect={setMoodAfter} label="How do you feel now?" />
                  <button onClick={handleCompleteSession} className="btn-primary w-full">✅ Complete Session</button>
                </div>
              )}

              <button onClick={handleToggleFavorite}
                className={`w-full mt-3 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                  isFavorite ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}>
                {isFavorite ? '❤️ Saved to Favorites' : '🤍 Save to Favorites'}
              </button>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-800">{activity.completionCount || 0}</div>
                  <div className="text-xs text-slate-400">Completions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800">{activity.rating?.toFixed(1) || '4.5'}</div>
                  <div className="text-xs text-slate-400">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
