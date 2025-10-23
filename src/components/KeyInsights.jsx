import React from 'react';

const KeyInsights = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-indigo-400/30">
      <h3 className="text-2xl font-bold text-white mb-6">Key Insights</h3>
      <div className="bg-black/30 rounded-lg p-5 border border-indigo-500/30">
        <h4 className="font-bold text-white mb-3 text-lg">🎯 Key Insights</h4>
        <div className="space-y-2 text-sm text-indigo-100">
          <p><strong>Memory Efficiency:</strong> Bloom Filter ≈ Cuckoo Filter {'<'} Count-Min Sketch {'<<'} Hash Map</p>
          <p><strong>Deletion Support:</strong> Only Hash Map and Cuckoo Filter support deletion - critical for crawlers that need to remove stale URLs</p>
          <p><strong>Best for Membership:</strong> Cuckoo Filter offers the best balance - low FPR, deletion support, and fast lookups</p>
          <p><strong>Best for Frequency:</strong> Count-Min Sketch uniquely tracks URL visit counts, enabling prioritization of popular pages</p>
          <p><strong>Production Recommendation:</strong> Use Cuckoo Filter for URL tracking + Count-Min Sketch for prioritization</p>
        </div>
      </div>
    </div>
  );
};

export default KeyInsights;