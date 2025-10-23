import React from 'react';
import { Database, Filter, Hash, BarChart3 } from 'lucide-react';

const ComparisonGrid = ({ metrics, countMinSketch, theoreticalBloomFPR, theoreticalCuckooFPR ,theoreticalCountMinFPR }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Hash Map */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30">
        <div className="flex items-center gap-3 mb-6">
          <Database className="text-green-400" size={28} />
          <div>
            <h2 className="text-xl font-bold text-white">Hash Map</h2>
            <p className="text-green-300 text-sm">Exact</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-green-200 font-semibold text-sm mb-1">Memory</div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.hashSetMemory} MB</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-green-200 font-semibold text-sm mb-1">Insert Time</div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.hashSetTime} ms</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-green-200 font-semibold text-sm mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-white">100%</div>
          </div>
        </div>
      </div>

      {/* Bloom Filter */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="text-purple-400" size={28} />
          <div>
            <h2 className="text-xl font-bold text-white">Bloom Filter</h2>
            <p className="text-purple-300 text-sm">Probabilistic</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-purple-200 font-semibold text-sm mb-1">Memory</div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.bloomFilterMemory} MB</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-purple-200 font-semibold text-sm mb-1">Insert Time</div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.bloomFilterTime} ms</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-purple-200 font-semibold text-sm mb-1">FPR (Theory)</div>
            <div className="text-2xl font-bold text-white font-mono">{theoreticalBloomFPR}%</div>
          </div>
        </div>
      </div>

      {/* Cuckoo Filter */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-400/30">
        <div className="flex items-center gap-3 mb-6">
          <Hash className="text-orange-400" size={28} />
          <div>
            <h2 className="text-xl font-bold text-white">Cuckoo Filter</h2>
            <p className="text-orange-300 text-sm">+ Deletion</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-orange-200 font-semibold text-sm mb-1">Memory</div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.cuckooFilterMemory} MB</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-orange-200 font-semibold text-sm mb-1">Insert Time</div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.cuckooFilterTime} ms</div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-orange-200 font-semibold text-sm mb-1">FPR (Theory)</div>
            <div className="text-2xl font-bold text-white font-mono">{theoreticalCuckooFPR}%</div>
          </div>
        </div>
      </div>

    
      {/* Count-Min Sketch */}
<div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30">
  <div className="flex items-center gap-3 mb-6">
    <BarChart3 className="text-blue-400" size={28} />
    <div>
      <h2 className="text-xl font-bold text-white">Count-Min Sketch</h2>
      <p className="text-blue-300 text-sm">Frequency</p>
    </div>
  </div>
  
  <div className="space-y-4">
    <div className="bg-black/20 rounded-lg p-4">
      <div className="text-blue-200 font-semibold text-sm mb-1">Memory</div>
      <div className="text-2xl font-bold text-white font-mono">{metrics.countMinSketchMemory} MB</div>
    </div>
    
    <div className="bg-black/20 rounded-lg p-4">
      <div className="text-blue-200 font-semibold text-sm mb-1">Insert Time</div>
      <div className="text-2xl font-bold text-white font-mono">{metrics.countMinSketchTime} ms</div>
    </div>
    
    <div className="bg-black/20 rounded-lg p-4">
      <div className="text-blue-200 font-semibold text-sm mb-1">Total Counts</div>
      <div className="text-2xl font-bold text-white">{countMinSketch.totalCount}</div>
    </div>
    
    <div className="bg-black/20 rounded-lg p-4">
      <div className="text-blue-200 font-semibold text-sm mb-1">FPR (Theory)</div>
      <div className="text-2xl font-bold text-white font-mono">{theoreticalCountMinFPR}%</div>
    </div>
  </div>
</div>
    </div>
  );
};

export default ComparisonGrid;