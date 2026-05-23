import React, { useState, useEffect, useRef } from 'react';

const BreathingExercise = ({ pattern = { inhaleSeconds: 4, holdSeconds: 4, exhaleSeconds: 4, cycles: 8 } }) => {
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, done
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const phases = [
    { name: 'inhale', label: 'Breathe In', duration: pattern.inhaleSeconds, color: 'from-blue-400 to-cyan-400', scale: 'scale-125' },
    { name: 'hold', label: 'Hold', duration: pattern.holdSeconds, color: 'from-purple-400 to-indigo-400', scale: 'scale-125' },
    { name: 'exhale', label: 'Breathe Out', duration: pattern.exhaleSeconds, color: 'from-green-400 to-teal-400', scale: 'scale-100' },
  ];

  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const currentPhase = phases[phaseIndex];
    setCount(currentPhase.duration);

    intervalRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          // Move to next phase
          const nextPhaseIndex = (phaseIndex + 1) % phases.length;
          if (nextPhaseIndex === 0) {
            const nextCycle = cycle + 1;
            if (nextCycle >= pattern.cycles) {
              setIsRunning(false);
              setPhase('done');
              setCycle(0);
              setPhaseIndex(0);
              return 0;
            }
            setCycle(nextCycle);
          }
          setPhaseIndex(nextPhaseIndex);
          setPhase(phases[nextPhaseIndex].name);
          return phases[nextPhaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, phaseIndex]);

  const start = () => {
    setIsRunning(true);
    setPhase('inhale');
    setPhaseIndex(0);
    setCycle(0);
    setCount(pattern.inhaleSeconds);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setPhase('ready');
    setCount(0);
    setCycle(0);
    setPhaseIndex(0);
  };

  const currentPhaseConfig = phases[phaseIndex];
  const progress = isRunning ? ((currentPhaseConfig.duration - count) / currentPhaseConfig.duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className={`absolute w-52 h-52 rounded-full border-4 border-wellness-200 transition-all duration-1000 ${
          isRunning && phase === 'inhale' ? 'scale-110 border-blue-300' :
          isRunning && phase === 'exhale' ? 'scale-90 border-green-300' : ''
        }`} />

        {/* Main circle */}
        <div className={`w-44 h-44 rounded-full bg-gradient-to-br ${
          isRunning ? currentPhaseConfig.color : 'from-wellness-400 to-calm-400'
        } flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
          isRunning && phase === 'inhale' ? 'scale-110' :
          isRunning && phase === 'exhale' ? 'scale-90' : 'scale-100'
        }`}>
          <span className="text-white text-4xl font-bold">{isRunning ? count : '🌬️'}</span>
          <span className="text-white/90 text-sm font-medium mt-1">
            {phase === 'ready' ? 'Ready' :
             phase === 'done' ? 'Complete!' :
             currentPhaseConfig.label}
          </span>
        </div>
      </div>

      {/* Cycle counter */}
      {isRunning && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pattern.cycles }).map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i < cycle ? 'bg-wellness-500' : i === cycle ? 'bg-wellness-300 animate-pulse' : 'bg-slate-200'
            }`} />
          ))}
          <span className="text-sm text-slate-500 ml-2">Cycle {cycle + 1}/{pattern.cycles}</span>
        </div>
      )}

      {/* Phase label */}
      <div className="text-center">
        {isRunning ? (
          <p className="text-slate-600 font-medium">
            {currentPhaseConfig.label} for {currentPhaseConfig.duration} seconds
          </p>
        ) : phase === 'done' ? (
          <p className="text-wellness-600 font-semibold text-lg">🎉 Great job! Session complete.</p>
        ) : (
          <p className="text-slate-500">
            {pattern.inhaleSeconds}s inhale · {pattern.holdSeconds}s hold · {pattern.exhaleSeconds}s exhale
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <button onClick={start} className="btn-primary px-8">
            {phase === 'done' ? '🔄 Restart' : '▶ Start Breathing'}
          </button>
        ) : (
          <button onClick={stop} className="btn-secondary px-8">
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
