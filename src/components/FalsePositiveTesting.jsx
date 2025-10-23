import React from 'react';

const FalsePositiveTesting = ({ testFalsePositives, urlCount, testResults, bloomFPR, cuckooFPR, cmsFPR }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">False Positive Testing</h3>
      <p className="text-purple-200 mb-4">
        Test all probabilistic data structures with 5,000 unseen URLs to measure actual false positive rates.
        Count-Min Sketch is tested for false positives (reporting count {'>'} 0 for URLs never seen).
      </p>
      <button
        onClick={testFalsePositives}
        disabled={urlCount === 0}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
      >
        Run False Positive Test
      </button>
      
      {testResults.totalTests > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="text-purple-200 text-sm mb-1">Tests Run</div>
            <div className="text-2xl font-bold text-white font-mono">{testResults.totalTests.toLocaleString()}</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 border-l-4 border-purple-500">
            <div className="text-purple-200 text-sm mb-1">Bloom Filter FPs</div>
            <div className="text-2xl font-bold text-white font-mono">{testResults.bloomFP}</div>
            <div className="text-sm text-purple-300 font-mono">{bloomFPR}%</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 border-l-4 border-orange-500">
            <div className="text-orange-200 text-sm mb-1">Cuckoo Filter FPs</div>
            <div className="text-2xl font-bold text-white font-mono">{testResults.cuckooFP}</div>
            <div className="text-sm text-orange-300 font-mono">{cuckooFPR}%</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-blue-200 text-sm mb-1">Count-Min Sketch FPs</div>
            <div className="text-2xl font-bold text-white font-mono">{testResults.cmsFP}</div>
            <div className="text-sm text-blue-300 font-mono">{cmsFPR}%</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 border-l-4 border-green-500">
            <div className="text-green-200 text-sm mb-1">Hash Map FPs</div>
            <div className="text-2xl font-bold text-white font-mono">0</div>
            <div className="text-sm text-green-300 font-mono">0.000000%</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FalsePositiveTesting;