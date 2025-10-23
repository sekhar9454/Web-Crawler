import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const ControlPanel = ({ isRunning, setIsRunning, urlCount, reset, speed, setSpeed }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={urlCount >= 10000}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-white font-semibold">Speed:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-4xl font-bold text-white mb-2">{urlCount.toLocaleString()}</div>
        <div className="text-purple-200">URLs Processed</div>
      </div>
    </div>
  );
};

export default ControlPanel;