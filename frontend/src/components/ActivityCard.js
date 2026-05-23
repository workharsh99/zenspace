import React from 'react';
import { Link } from 'react-router-dom';

const categoryConfig = {
  MEDITATION: { emoji: '🧘', color: 'bg-purple-100 text-purple-700', gradient: 'from-purple-400 to-indigo-500' },
  BREATHING:  { emoji: '💨', color: 'bg-blue-100 text-blue-700',   gradient: 'from-blue-400 to-cyan-500' },
  YOGA:       { emoji: '🌿', color: 'bg-green-100 text-green-700', gradient: 'from-green-400 to-teal-500' },
  MUSIC:      { emoji: '🎵', color: 'bg-pink-100 text-pink-700',   gradient: 'from-pink-400 to-rose-500' },
  MOTIVATION: { emoji: '⭐', color: 'bg-orange-100 text-orange-700', gradient: 'from-orange-400 to-amber-500' },
};

const ActivityCard = ({ activity }) => {
  const config = categoryConfig[activity.category] || categoryConfig.MEDITATION;

  return (
    <Link to={`/activities/${activity.id}`} className="card-hover group block">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            <span className="text-6xl">{config.emoji}</span>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${config.color} shadow-sm`}>
            {config.emoji} {activity.category}
          </span>
        </div>
        {/* Featured Badge */}
        {activity.featured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-yellow-100 text-yellow-700 shadow-sm">⭐ Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-800 text-lg leading-tight mb-2 group-hover:text-wellness-600 transition-colors line-clamp-2">
          {activity.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {activity.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              ⏱️ {activity.durationMinutes} min
            </span>
            <span className="flex items-center gap-1">
              📊 {activity.difficulty || 'BEGINNER'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-medium text-slate-600">{activity.rating?.toFixed(1) || '4.5'}</span>
            <span>({activity.totalRatings || 0})</span>
          </div>
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {activity.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ActivityCard;
