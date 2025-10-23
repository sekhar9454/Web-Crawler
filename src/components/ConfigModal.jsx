import React from 'react';
import { Filter, Hash, BarChart3, Play } from 'lucide-react';

const ConfigModal = ({
  showConfigModal,
  setShowConfigModal,
  bloomFilterSize,
  setBloomFilterSize,
  numHashFunctions,
  setNumHashFunctions,
  cuckooCapacity,
  setCuckooCapacity,
  cuckooBucketSize,
  setCuckooBucketSize,
  cmsWidth,
  setCmsWidth,
  cmsDepth,
  setCmsDepth,
  setBloomFilter,
  setCuckooFilter,
  setCountMinSketch,
  BloomFilter,
  CuckooFilter,
  CountMinSketch
}) => {
  if (!showConfigModal) return null;

  // Preset configurations
  const applyBloomFilterPreset = (type) => {
    if (type === 'high') {
      setBloomFilterSize(5000000);
      setNumHashFunctions(8);
    } else if (type === 'balanced') {
      setBloomFilterSize(2500000);
      setNumHashFunctions(5);
    } else if (type === 'low') {
      setBloomFilterSize(10000);
      setNumHashFunctions(2);
    }
  };

  const applyCuckooFilterPreset = (type) => {
    if (type === 'high') {
      setCuckooCapacity(50000);
      setCuckooBucketSize(8);
    } else if (type === 'balanced') {
      setCuckooCapacity(25000);
      setCuckooBucketSize(5);
    } else if (type === 'low') {
      setCuckooCapacity(1000);
      setCuckooBucketSize(2);
    }
  };

  const applyCountMinSketchPreset = (type) => {
    if (type === 'high') {
      setCmsWidth(50000);
      setCmsDepth(8);
    } else if (type === 'balanced') {
      setCmsWidth(25000);
      setCmsDepth(6);
    } else if (type === 'low') {
      setCmsWidth(1000);
      setCmsDepth(3);
    }
  };

  const applyMasterBalancedPreset = () => {
    applyBloomFilterPreset('balanced');
    applyCuckooFilterPreset('balanced');
    applyCountMinSketchPreset('balanced');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/50 my-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-3xl sticky top-0 z-10">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Filter size={28} />
            Configure Data Structures
          </h2>
          <p className="text-purple-100 mb-4">
            Adjust parameters for Bloom Filter, Cuckoo Filter & Count-Min Sketch
          </p>
          <button
            onClick={applyMasterBalancedPreset}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Set All to Balanced Performance
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Bloom Filter Config */}
          <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Filter className="text-purple-400" size={24} />
              Bloom Filter Configuration
            </h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => applyBloomFilterPreset('high')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                High Performance
              </button>
              <button
                onClick={() => applyBloomFilterPreset('balanced')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Balanced Performance
              </button>
              <button
                onClick={() => applyBloomFilterPreset('low')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Low Performance
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-semibold">Bit Array Size (m)</label>
                  <span className="text-xl font-bold text-purple-300">{bloomFilterSize.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={bloomFilterSize}
                  onChange={(e) => setBloomFilterSize(Number(e.target.value))}
                  className="w-full h-3 bg-purple-700 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-semibold">Hash Functions (k)</label>
                  <span className="text-xl font-bold text-purple-300">{numHashFunctions}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numHashFunctions}
                  onChange={(e) => setNumHashFunctions(Number(e.target.value))}
                  className="w-full h-3 bg-purple-700 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Cuckoo Filter Config */}
          <div className="bg-black/30 rounded-xl p-6 border border-orange-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Hash className="text-orange-400" size={24} />
              Cuckoo Filter Configuration
            </h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => applyCuckooFilterPreset('high')}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                High Performance
              </button>
              <button
                onClick={() => applyCuckooFilterPreset('balanced')}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Balanced Performance
              </button>
              <button
                onClick={() => applyCuckooFilterPreset('low')}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Low Performance
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-semibold">Capacity</label>
                  <span className="text-xl font-bold text-orange-300">{cuckooCapacity.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={cuckooCapacity}
                  onChange={(e) => setCuckooCapacity(Number(e.target.value))}
                  className="w-full h-3 bg-orange-700 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-semibold">Bucket Size</label>
                  <span className="text-xl font-bold text-orange-300">{cuckooBucketSize}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={cuckooBucketSize}
                  onChange={(e) => setCuckooBucketSize(Number(e.target.value))}
                  className="w-full h-3 bg-orange-700 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Count-Min Sketch Config */}
          <div className="bg-black/30 rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-400" size={24} />
              Count-Min Sketch Configuration
            </h3>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => applyCountMinSketchPreset('high')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                High Performance
              </button>
              <button
                onClick={() => applyCountMinSketchPreset('balanced')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Balanced Performance
              </button>
              <button
                onClick={() => applyCountMinSketchPreset('low')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Low Performance
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-semibold">Width</label>
                  <span className="text-xl font-bold text-blue-300">{cmsWidth.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={cmsWidth}
                  onChange={(e) => setCmsWidth(Number(e.target.value))}
                  className="w-full h-3 bg-blue-700 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-white font-semibold">Depth</label>
                  <span className="text-xl font-bold text-blue-300">{cmsDepth}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={cmsDepth}
                  onChange={(e) => setCmsDepth(Number(e.target.value))}
                  className="w-full h-3 bg-blue-700 rounded-lg"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setBloomFilter(new BloomFilter(bloomFilterSize, numHashFunctions));
              setCuckooFilter(new CuckooFilter(cuckooCapacity, cuckooBucketSize));
              setCountMinSketch(new CountMinSketch(cmsWidth, cmsDepth));
              setShowConfigModal(false);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
          >
            <Play size={24} />
            Start Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;