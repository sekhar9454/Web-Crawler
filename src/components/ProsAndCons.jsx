import React from 'react';
import { Database, Filter, Hash, BarChart3 } from 'lucide-react';

const ProsAndCons = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-indigo-400/30">
      <h3 className="text-2xl font-bold text-white mb-6">Comparative Analysis: Pros & Cons</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hash Map */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="font-bold text-green-400 mb-3 text-lg flex items-center gap-2">
            <Database size={20} />
            Hash Map
          </h4>
          <div className="space-y-2 text-sm text-green-100">
            <div><strong>✓ Pros:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• Perfect accuracy (0% FPR)</li>
              <li>• O(1) lookups and insertions</li>
              <li>• Simple implementation</li>
              <li>• Supports deletion</li>
            </ul>
            <div className="mt-2"><strong>✗ Cons:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• High memory usage (~100 bytes/URL)</li>
              <li>• Not scalable to billions of URLs</li>
            </ul>
          </div>
        </div>

        {/* Bloom Filter */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="font-bold text-purple-400 mb-3 text-lg flex items-center gap-2">
            <Filter size={20} />
            Bloom Filter
          </h4>
          <div className="space-y-2 text-sm text-purple-100">
            <div><strong>✓ Pros:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• Extremely memory efficient</li>
              <li>• Fast O(k) operations</li>
              <li>• Scalable to billions of URLs</li>
              <li>• Tunable FPR via m and k</li>
            </ul>
            <div className="mt-2"><strong>✗ Cons:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• False positives possible</li>
              <li>• No deletion support</li>
              <li>• FPR increases with load</li>
            </ul>
          </div>
        </div>

        {/* Cuckoo Filter */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="font-bold text-orange-400 mb-3 text-lg flex items-center gap-2">
            <Hash size={20} />
            Cuckoo Filter
          </h4>
          <div className="space-y-2 text-sm text-orange-100">
            <div><strong>✓ Pros:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• Memory efficient (slightly more than Bloom)</li>
              <li>• Supports deletion (major advantage!)</li>
              <li>• Better FPR than Bloom at high loads</li>
              <li>• Faster lookups (2 checks vs k checks)</li>
            </ul>
            <div className="mt-2"><strong>✗ Cons:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• Can fail insertions when full</li>
              <li>• More complex implementation</li>
              <li>• Slightly slower insertions (cuckoo hashing)</li>
            </ul>
          </div>
        </div>

        {/* Count-Min Sketch */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="font-bold text-blue-400 mb-3 text-lg flex items-center gap-2">
            <BarChart3 size={20} />
            Count-Min Sketch
          </h4>
          <div className="space-y-2 text-sm text-blue-100">
            <div><strong>✓ Pros:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• Tracks frequency counts</li>
              <li>• Sublinear space O(log n)</li>
              <li>• Fast updates and queries</li>
              <li>• Useful for URL popularity ranking</li>
            </ul>
            <div className="mt-2"><strong>✗ Cons:</strong></div>
            <ul className="ml-4 space-y-1">
              <li>• Overestimates counts (never underestimates)</li>
              <li>• No deletion support</li>
              <li>• Different use case (frequency vs membership)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProsAndCons;