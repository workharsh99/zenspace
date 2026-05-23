import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityApi } from '../api/axios.js';
import ActivityCard from '../components/ActivityCard.jsx';
import BreathingExercise from '../components/BreathingExercise.jsx';

const quotes = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "Peace is the result of retraining your mind to process life as it is.", author: "Wayne Dyer" },
  { text: "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure.", author: "Oprah Winfrey" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
];

const categories = [
  {
    name: 'MEDITATION',
    emoji: '🧘',
    label: 'Meditation',
    desc: 'Calm your mind',
    gradient: 'from-purple-500 to-indigo-600',
    stats: '12 guided sessions',
  },
  {
    name: 'BREATHING',
    emoji: '💨',
    label: 'Breathing',
    desc: 'Breathe deeply',
    gradient: 'from-blue-500 to-cyan-600',
    stats: '8 breathwork routines',
  },
  {
    name: 'YOGA',
    emoji: '🌿',
    label: 'Yoga',
    desc: 'Move & stretch',
    gradient: 'from-green-500 to-teal-600',
    stats: '10 beginner flows',
  },
  {
    name: 'MUSIC',
    emoji: '🎵',
    label: 'Music',
    desc: 'Soothing sounds',
    gradient: 'from-pink-500 to-rose-600',
    stats: '15 relaxing tracks',
  },
  {
    name: 'MOTIVATION',
    emoji: '⭐',
    label: 'Motivation',
    desc: 'Inspire yourself',
    gradient: 'from-orange-500 to-amber-600',
    stats: '9 daily boosts',
  },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityApi.get('/featured')
      .then(res => setFeatured(res.data.slice(0, 3)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wellness-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-calm-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <span className="w-2 h-2 bg-wellness-400 rounded-full animate-pulse" />
                Your Daily Wellness Companion
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white font-display leading-tight mb-6">
                Find Your
                <span className="block bg-gradient-to-r from-wellness-400 to-calm-400 bg-clip-text text-transparent">
                  Inner Peace
                </span>
              </h1>
              <p className="text-slate-300 text-xl leading-relaxed mb-8 max-w-lg">
                Guided meditations, breathing exercises, yoga sessions, and more —
                all designed to help you manage stress and cultivate lasting wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/activities" className="btn-primary text-base px-8 py-4">🌿 Explore Activities</Link>
                <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-base">
                  ✨ Start Free Today
                </Link>
              </div>
              <div className="flex gap-8 mt-10 justify-center lg:justify-start">
                {[{ value: '10+', label: 'Activities' }, { value: '5', label: 'Categories' }, { value: '100%', label: 'Free' }].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-slate-400 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 w-full max-w-sm">
                <h3 className="text-white font-semibold text-center mb-1">Quick Breathing Exercise</h3>
                <p className="text-slate-300 text-sm text-center mb-2">Try the 4-4-4 box breathing technique</p>
                <BreathingExercise pattern={{ inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 4, cycles: 4 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Quote */}
      <section className="bg-gradient-to-r from-wellness-600 to-calm-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/70 text-sm font-medium mb-3 uppercase tracking-wider">Daily Inspiration</p>
          <blockquote className="text-white text-2xl font-display font-medium leading-relaxed mb-4">
            "{quote.text}"
          </blockquote>
          <cite className="text-white/70 text-sm">— {quote.author}</cite>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore Wellness Categories</h2>
            <p className="section-subtitle">Choose your path to inner peace</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} to={`/activities?category=${cat.name}`}
                className="group flex flex-col items-center p-6 rounded-2xl border-2 border-slate-100 hover:border-wellness-200 hover:bg-wellness-50 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-md`}>
                  {cat.emoji}
                </div>
                <span className="font-semibold text-slate-800 text-sm">{cat.label}</span>
                <span className="text-slate-400 text-xs mt-1">{cat.desc}</span>
                <span className="text-slate-500 text-[11px] mt-3 uppercase tracking-[0.18em] font-semibold">{cat.stats}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Activities</h2>
              <p className="section-subtitle">Handpicked for your wellness journey</p>
            </div>
            <Link to="/activities" className="btn-secondary text-sm hidden sm:block">View All →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
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
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(a => <ActivityCard key={a.id} activity={a} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">🌿</p>
              <p>Activities loading... Make sure the backend services are running.</p>
              <Link to="/activities" className="btn-primary mt-4 inline-block">Browse Activities</Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Your Wellness Journey</h2>
            <p className="section-subtitle">Simple steps to a calmer, healthier you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { emoji: '📝', title: 'Create Account', desc: 'Sign up free and set your wellness goals' },
              { emoji: '🔍', title: 'Explore Activities', desc: 'Browse meditations, yoga, breathing and more' },
              { emoji: '🧘', title: 'Practice Daily', desc: 'Complete sessions and track your progress' },
              { emoji: '📈', title: 'Track Progress', desc: 'Monitor your wellness journey and celebrate wins' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-wellness-100 to-calm-100 rounded-2xl flex items-center justify-center text-3xl mx-auto group-hover:scale-110 transition-transform shadow-sm">
                    {item.emoji}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-wellness-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{i+1}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white font-display mb-4">Start Your Wellness Journey Today</h2>
          <p className="text-slate-300 text-lg mb-8">Join thousands of people who have found their calm with ZenSpace.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-10 py-4">🌟 Get Started Free</Link>
            <Link to="/activities" className="inline-flex items-center justify-center px-10 py-4 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-base">
              Browse Activities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
