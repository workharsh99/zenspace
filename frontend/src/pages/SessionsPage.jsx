import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { sessionApi } from '../api/axios.js';
import toast from 'react-hot-toast';

const categoryEmojis = { MEDITATION: '🧘', BREATHING: '💨', YOGA: '🌿', MUSIC: '🎵', MOTIVATION: '⭐' };

const statusConfig = {
  COMPLETED:   { color: 'bg-green-100 text-green-700',  icon: '✅' },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-700',    icon: '▶' },
  ABANDONED:   { color: 'bg-slate-100 text-slate-500',  icon: '⏹' },
};

const SessionsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!user?.userId) { setLoading(false); return; }
    const userId = user.userId;
    Promise.all([
      sessionApi.get(`/user/${userId}`),
      sessionApi.get(`/favorites/user/${userId}`),
    ]).then(([sessRes, favRes]) => {
      setSessions(sessRes.data);
      setFavorites(favRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemoveFavorite = async (activityId) => {
    try {
      await sessionApi.delete(`/favorites/${activityId}`);
      setFavorites(prev => prev.filter(f => f.activityId !== activityId));
      toast.success('Removed from favorites');
    } catch { toast.error('Failed to remove favorite'); }
  };

  const filteredSessions = filter === 'ALL' ? sessions : sessions.filter(s => s.status === filter);

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white font-display mb-2">My Wellness Journey</h1>
          <p className="text-slate-300">Track your sessions and saved activities</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100 mb-8 w-fit">
          {[
            { id: 'sessions',   label: `Sessions (${sessions.length})`,   emoji: '📊' },
            { id: 'favorites',  label: `Favorites (${favorites.length})`, emoji: '❤️' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-wellness-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}>
              <span>{tab.emoji}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-wellness-200 border-t-wellness-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div>
                <div className="flex gap-2 mb-6">
                  {['ALL', 'COMPLETED', 'IN_PROGRESS', 'ABANDONED'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'
                      }`}>
                      {f === 'ALL' ? 'All' : f.replace('_', ' ')}
                      {f !== 'ALL' && <span className="ml-1 opacity-70">({sessions.filter(s => s.status === f).length})</span>}
                    </button>
                  ))}
                </div>

                {filteredSessions.length > 0 ? (
                  <div className="space-y-3">
                    {filteredSessions.map(session => {
                      const sc = statusConfig[session.status] || statusConfig.ABANDONED;
                      return (
                        <div key={session.id} className="card p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-wellness-400 to-calm-400 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                              {categoryEmojis[session.activityCategory] || '🧘'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-slate-800 truncate">{session.activityTitle || 'Wellness Session'}</h3>
                                <span className={`badge ${sc.color} flex-shrink-0`}>{sc.icon} {session.status.replace('_', ' ')}</span>
                              </div>
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                                {session.createdAt && <span>📅 {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                                {session.actualDurationMinutes > 0 && <span>⏱️ {session.actualDurationMinutes} min</span>}
                                {session.moodBefore && <span>Before: {session.moodBefore}</span>}
                                {session.moodAfter && <span>After: {session.moodAfter}</span>}
                                {session.rating > 0 && <span>★ {session.rating}</span>}
                              </div>
                              {session.notes && <p className="text-slate-500 text-sm mt-2 italic">"{session.notes}"</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">🌱</p>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No sessions yet</h3>
                    <p className="text-slate-400 mb-6">Start your first wellness activity to track your progress</p>
                    <Link to="/activities" className="btn-primary">Browse Activities</Link>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map(fav => (
                      <div key={fav.id} className="card overflow-hidden group">
                        <div className="relative h-36 overflow-hidden">
                          {fav.activityImageUrl ? (
                            <img src={fav.activityImageUrl} alt={fav.activityTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-wellness-400 to-calm-500 flex items-center justify-center">
                              <span className="text-4xl">{categoryEmojis[fav.activityCategory] || '🧘'}</span>
                            </div>
                          )}
                          <button onClick={() => handleRemoveFavorite(fav.activityId)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all shadow-sm"
                            title="Remove from favorites">❤️</button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-1">{fav.activityTitle}</h3>
                          <p className="text-slate-400 text-xs mb-3">
                            {fav.activityCategory} · Saved {fav.savedAt ? new Date(fav.savedAt).toLocaleDateString() : 'recently'}
                          </p>
                          <Link to={`/activities/${fav.activityId}`} className="btn-primary text-xs py-2 w-full text-center block">
                            Start Activity →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">🤍</p>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No favorites yet</h3>
                    <p className="text-slate-400 mb-6">Save activities you love to find them quickly</p>
                    <Link to="/activities" className="btn-primary">Explore Activities</Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionsPage;
