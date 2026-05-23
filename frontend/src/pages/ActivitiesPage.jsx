import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activityApi } from '../api/axios.js';
import ActivityCard from '../components/ActivityCard.jsx';

const categories = ['ALL', 'MEDITATION', 'BREATHING', 'YOGA', 'MUSIC', 'MOTIVATION'];
const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const categoryEmojis = { ALL: '🌟', MEDITATION: '🧘', BREATHING: '💨', YOGA: '🌿', MUSIC: '🎵', MOTIVATION: '⭐' };

const sampleActivities = [
  {
    id: 'sample-1',
    title: 'Morning Mindfulness Meditation',
    description: 'Start your day with a calming 10-minute meditation to center your mind and reduce stress.',
    category: 'MEDITATION',
    difficulty: 'BEGINNER',
    durationMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    rating: 4.8,
    completionCount: 1820,
    tags: ['morning', 'mindfulness', 'stress-relief'],
  },
  {
    id: 'sample-2',
    title: '4-7-8 Breathing Practice',
    description: 'Use the 4-7-8 breathing rhythm to calm your nerves and ease tension quickly.',
    category: 'BREATHING',
    difficulty: 'BEGINNER',
    durationMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    rating: 4.9,
    completionCount: 3200,
    tags: ['breathing', 'relaxation', 'anxiety'],
  },
  {
    id: 'sample-3',
    title: 'Gentle Yoga Flow',
    description: 'A slow, beginner-friendly yoga sequence designed to release tension and improve flexibility.',
    category: 'YOGA',
    difficulty: 'BEGINNER',
    durationMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800',
    rating: 4.7,
    completionCount: 1450,
    tags: ['yoga', 'stretching', 'calm'],
  },
  {
    id: 'sample-4',
    title: 'Relaxing Nature Sounds',
    description: 'Listen to soothing nature tracks that help you unwind and stay present.',
    category: 'MUSIC',
    difficulty: 'BEGINNER',
    durationMinutes: 30,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    rating: 4.6,
    completionCount: 2100,
    tags: ['nature', 'music', 'relaxation'],
  },
  {
    id: 'sample-5',
    title: 'Daily Motivation Booster',
    description: 'Short daily affirmation practice to help you stay motivated and confident.',
    category: 'MOTIVATION',
    difficulty: 'BEGINNER',
    durationMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    rating: 4.5,
    completionCount: 980,
    tags: ['affirmations', 'motivation', 'positivity'],
  },
];

const ActivitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [sortBy, setSortBy] = useState('rating');
  const [usingSampleData, setUsingSampleData] = useState(false);

  useEffect(() => {
    activityApi.get('/')
      .then(res => {
        const responseActivities = Array.isArray(res.data) ? res.data : [];
        if (responseActivities.length === 0) {
          setUsingSampleData(true);
          setActivities(sampleActivities);
        } else {
          setUsingSampleData(false);
          setActivities(responseActivities);
        }
      })
      .catch(() => {
        setUsingSampleData(true);
        setActivities(sampleActivities);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...activities];
    if (category !== 'ALL') result = result.filter(a => a.category === category);
    if (difficulty !== 'ALL') result = result.filter(a => a.difficulty === difficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popular') return (b.completionCount || 0) - (a.completionCount || 0);
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
    setFiltered(result);
  }, [activities, category, difficulty, search, sortBy]);

  const handleCategoryChange = cat => {
    setCategory(cat);
    cat !== 'ALL' ? setSearchParams({ category: cat }) : setSearchParams({});
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white font-display mb-3">Wellness Activities</h1>
          <p className="text-slate-300 text-lg mb-2">Discover {activities.length}+ activities for stress relief and mental wellness</p>
          {usingSampleData && (
            <p className="text-yellow-200 text-sm mb-4">Displaying sample content while backend activity data is unavailable.</p>
          )}
          <div className="max-w-xl mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search activities, tags, categories..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-wellness-400 transition-all" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat ? 'bg-wellness-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-wellness-300'
                }`}>
                <span>{categoryEmojis[cat]}</span>
                <span>{cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-auto min-w-[160px] text-sm">
            <option value="rating">⭐ Top Rated</option>
            <option value="popular">🔥 Most Popular</option>
            <option value="duration">⏱️ Duration</option>
            <option value="title">🔤 A-Z</option>
          </select>
        </div>

        <div className="flex gap-2 mb-6">
          {difficulties.map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                difficulty === d ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'
              }`}>
              {d === 'ALL' ? 'All Levels' : d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <p className="text-slate-500 text-sm mb-6">{loading ? 'Loading...' : `${filtered.length} activities found`}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(a => <ActivityCard key={a.id} activity={a} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No activities found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCategory('ALL'); setDifficulty('ALL'); }} className="btn-secondary mt-4">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;
