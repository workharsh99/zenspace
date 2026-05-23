import React, { useState } from 'react';

const moods = [
  { value: 'STRESSED', emoji: '😰', label: 'Stressed', color: 'border-red-300 bg-red-50 text-red-700' },
  { value: 'ANXIOUS',  emoji: '😟', label: 'Anxious',  color: 'border-orange-300 bg-orange-50 text-orange-700' },
  { value: 'NEUTRAL',  emoji: '😐', label: 'Neutral',  color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
  { value: 'CALM',     emoji: '😌', label: 'Calm',     color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'HAPPY',    emoji: '😊', label: 'Happy',    color: 'border-green-300 bg-green-50 text-green-700' },
];

const MoodTracker = ({ onMoodSelect, label = 'How are you feeling?' }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (mood) => {
    setSelected(mood.value);
    if (onMoodSelect) onMoodSelect(mood.value);
  };

  return (
    <div className="space-y-3">
      <p className="text-slate-700 font-medium text-sm">{label}</p>
      <div className="flex flex-wrap gap-2">
        {moods.map(mood => (
          <button key={mood.value} onClick={() => handleSelect(mood)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all duration-200 font-medium text-xs ${
              selected === mood.value
                ? mood.color + ' scale-105 shadow-md'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}>
            <span className="text-lg">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
