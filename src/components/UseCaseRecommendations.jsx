import React from 'react';

const UseCaseRecommendations = () => {
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-lg p-5 border border-purple-500/30">
      <h4 className="font-bold text-white mb-3 text-lg">💡 Use Case Recommendations</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-black/20 rounded p-3">
          <div className="text-green-300 font-semibold mb-1">Choose Hash Map if:</div>
          <ul className="text-green-100 ml-4 space-y-1">
            <li>• Small dataset ({'<'}1M URLs)</li>
            <li>• Memory is abundant</li>
            <li>• Need 100% accuracy</li>
          </ul>
        </div>
        
        <div className="bg-black/20 rounded p-3">
          <div className="text-purple-300 font-semibold mb-1">Choose Bloom Filter if:</div>
          <ul className="text-purple-100 ml-4 space-y-1">
            <li>• Billions of URLs</li>
            <li>• No deletion needed</li>
            <li>• Can tolerate 1-5% FPR</li>
          </ul>
        </div>
        
        <div className="bg-black/20 rounded p-3">
          <div className="text-orange-300 font-semibold mb-1">Choose Cuckoo Filter if:</div>
          <ul className="text-orange-100 ml-4 space-y-1">
            <li>• Need deletion support</li>
            <li>• Want low FPR</li>
            <li>• Millions to billions of URLs</li>
          </ul>
        </div>
        
        <div className="bg-black/20 rounded p-3">
          <div className="text-blue-300 font-semibold mb-1">Choose Count-Min Sketch if:</div>
          <ul className="text-blue-100 ml-4 space-y-1">
            <li>• Need frequency counts</li>
            <li>• Prioritizing popular URLs</li>
            <li>• Building recommendation systems</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UseCaseRecommendations;