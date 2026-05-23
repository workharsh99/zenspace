import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionApi, activityApi } from '../api/axios';

const quotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are stronger than you think. Keep going.",
  "Small steps every day lead to big changes.",
  "Your mental health is a priority. Your happiness is essential.",
  "Breathe. You've got this.",
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    if (!user?.userId) return;
    const userId = user.userId;

    Promise.all([
      sessionApi.get(`/stats/${userId}`),
      sessionApi.get(`/favorites/user/${userId}`),
      sessionApi.get(`/user/${userId}`),
    ]).then(([statsRes, favRes, sessionsRes]) => {
      setStats(statsRes.data);
      setFavorites(favRes.data.slice(0, 4));
      setRecentSessions(sessionsRes.data.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const categoryEmojis = {
    MEDITATION: '🧘', BREATHING: '💨', YOGA: '🌿', MUSIC: '🎵', MOTIVATION: '⭐'
  };

  const moodEmojis = {
    STRESSED: '😰', ANXIOUS: '😟', NEUTRAL: '😐', CALM: '😌', HAPPY: '😊'
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-wellness-200 border-t-wellness-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-wellness-400 to-calm-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              {user?.firstName?.[0] || user?.username?.[0] || '🧘'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-display">
                Welcome back, {user?.firstName || user?.username}! 👋
              </h1>
              <p className="text-slate-300 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-2xl">
            <p className="text-white/70 text-xs mb-1">💭 Daily Inspiration</p>
            <p className="text-white font-medium italic">"{quote}"</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: stats?.totalSessions || 0, emoji: '📊', color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: stats?.completedSessions || 0, emoji: '✅', color: 'from-green-500 to-teal-500' },
            { label: 'Minutes Practiced', value: stats?.totalMinutes || 0, emoji: '⏱️', color: 'from-purple-500 to-indigo-500' },
            { label: 'Favorites', value: stats?.favoritesCount || 0, emoji: '❤️', color: 'from-pink-500 to-rose-500' },
          ].map(stat => (
            <div key={stat.label} className="card p-5">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl mb-3 shadow-sm`}>
                {stat.emoji}
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wellness Progress */}
            {stats && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-800 text-lg mb-5">📈 Wellness Progress</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-wellness-50 rounded-xl">
                    <div className="text-3xl font-bold text-wellness-600">{stats.currentStreak}</div>
                    <div className="text-slate-500 text-sm mt-1">Day Streak 🔥</div>
                  </div>
                  <div className="text-center p-4 bg-calm-50 rounded-xl">
                    <div className="text-3xl font-bold text-calm-600">
                      {stats.averageStressReduction > 0 ? `-${stats.averageStressReduction}` : '0'}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Stress Reduction</div>
                  </div>
                  <div className="text-center p-4 bg-serenity-50 rounded-xl">
                    <div className="text-3xl font-bold text-serenity-600">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Avg Session Rating</div>
                  </div>
                </div>

                {/* Category breakdown */}
                {stats.sessionsByCategory && Object.keys(stats.sessionsByCategory).length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-600 mb-3">Sessions by Category</p>
                    <div className="space-y-2">
                      {Object.entries(stats.sessionsByCategory).map(([cat, count]) => {
                        const total = stats.completedSessions || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={cat} className="flex items-center gap-3">
                            <span className="text-sm w-24 text-slate-600">{categoryEmojis[cat]} {cat}</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                              <div className="bg-wellness-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-slate-400 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Sessions */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-800 text-lg">🕐 Recent Sessions</h2>
                <Link to="/sessions" className="text-wellness-600 text-sm hover:text-wellness-700 font-medium">
                  View All →
                </Link>
              </div>

              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map(session => (
                    <div key={session.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-wellness-400 to-calm-400 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {categoryEmojis[session.activityCategory] || '🧘'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{session.activityTitle || 'Wellness Session'}</p>
                        <p className="text-slate-400 text-xs">
                          {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Recent'}
                          {session.actualDurationMinutes > 0 && ` · ${session.actualDurationMinutes} min`}
                        </p>
                      </div>
                      <span className={`badge text-xs ${
                        session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        session.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {session.status === 'COMPLETED' ? '✅' : session.status === 'IN_PROGRESS' ? '▶' : '⏹'} {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-3xl mb-2">🌱</p>
                  <p className="text-sm">No sessions yet. Start your first activity!</p>
                  <Link to="/activities" className="btn-primary text-sm mt-3 inline-block">
                    Browse Activities
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800 text-lg mb-4">⚡ Quick Start</h2>
              <div className="space-y-2">
                {[
                  { to: '/activities?category=MEDITATION', emoji: '🧘', label: 'Meditate Now', color: 'hover:bg-purple-50 hover:border-purple-200' },
                  { to: '/activities?category=BREATHING', emoji: '💨', label: 'Breathing Exercise', color: 'hover:bg-blue-50 hover:border-blue-200' },
                  { to: '/activities?category=YOGA', emoji: '🌿', label: 'Yoga Session', color: 'hover:bg-green-50 hover:border-green-200' },
                  { to: '/activities?category=MOTIVATION', emoji: '⭐', label: 'Get Motivated', color: 'hover:bg-orange-50 hover:border-orange-200' },
                ].map(item => (
                  <Link key={item.to} to={item.to}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-slate-200 transition-all ${item.color}`}>
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="ml-auto text-slate-400">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800 text-lg">❤️ Favorites</h2>
                <Link to="/sessions" className="text-wellness-600 text-sm hover:text-wellness-700 font-medium">
                  View All →
                </Link>
              </div>

              {favorites.length > 0 ? (
                <div className="space-y-2">
                  {favorites.map(fav => (
                    <Link key={fav.id} to={`/activities/${fav.activityId}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                        {categoryEmojis[fav.activityCategory] || '🧘'}
                      </div>
                      <span className="text-sm text-slate-700 group-hover:text-wellness-600 transition-colors truncate">
                        {fav.activityTitle}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-2xl mb-2">🤍</p>
                  <p className="text-xs">Save activities you love</p>
                </div>
              )}
            </div>

            {/* Wellness Tip */}
            <div className="card p-6 bg-gradient-to-br from-wellness-50 to-calm-50 border-wellness-100">
              <h3 className="font-semibold text-wellness-800 mb-2">💡 Wellness Tip</h3>
              <p className="text-wellness-700 text-sm leading-relaxed">
                Consistency is key! Even 5 minutes of daily meditation can significantly reduce stress levels over time. 
                Try to practice at the same time each day to build a lasting habit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
