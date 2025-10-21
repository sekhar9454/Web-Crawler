import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Database, Filter, CheckCircle, XCircle, Clock, HardDrive } from 'lucide-react';

// Bloom Filter Implementation
class BloomFilter {
  constructor(size, numHashes) {
    this.size = size;
    this.numHashes = numHashes;
    this.bitArray = new Array(size).fill(0);
    this.itemCount = 0;
  }

  hash(str, seed) {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % this.size;
  }

  add(url) {
    for (let i = 0; i < this.numHashes; i++) {
      const index = this.hash(url, i);
      this.bitArray[index] = 1;
    }
    this.itemCount++;
  }

  contains(url) {
    for (let i = 0; i < this.numHashes; i++) {
      const index = this.hash(url, i);
      if (this.bitArray[index] === 0) return false;
    }
    return true;
  }

  getMemoryUsage() {
    return this.size / 8 / 1024 / 1024; // Convert bits to MB
  }

  getFalsePositiveRate() {
    const m = this.size;
    const k = this.numHashes;
    const n = this.itemCount;
    return Math.pow(1 - Math.exp(-k * n / m), k);
  }
}

const URLTrackerComparison = () => {
  const [hashSet, setHashSet] = useState(new Set());
  const [bloomFilterSize, setBloomFilterSize] = useState(1000000);
  const [numHashFunctions, setNumHashFunctions] = useState(3);
  const [bloomFilter, setBloomFilter] = useState(new BloomFilter(1000000, 3));
  const [urlCount, setUrlCount] = useState(0);
  const [testResults, setTestResults] = useState({ falsePositives: 0, totalTests: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [showConfigModal, setShowConfigModal] = useState(true);
  const [metrics, setMetrics] = useState({
    hashSetTime: 0,
    bloomFilterTime: 0,
    hashSetMemory: 0,
    bloomFilterMemory: 0
  });

  const generateURL = (index) => {
    const domains = [
      'example.com', 'test.org', 'demo.net', 'site.io', 'web.dev',
      'github.com', 'stackoverflow.com', 'medium.com', 'dev.to', 'reddit.com',
      'twitter.com', 'facebook.com', 'linkedin.com', 'instagram.com', 'youtube.com',
      'amazon.com', 'ebay.com', 'shopify.com', 'etsy.com', 'aliexpress.com',
      'wikipedia.org', 'news.ycombinator.com', 'techcrunch.com', 'theverge.com',
      'cnn.com', 'bbc.com', 'nytimes.com', 'guardian.com', 'wsj.com',
      'google.com', 'bing.com', 'duckduckgo.com', 'yahoo.com', 'baidu.com'
    ];
    
    const paths = [
      'blog', 'api', 'docs', 'about', 'contact', 'products', 'services',
      'home', 'index', 'search', 'profile', 'settings', 'dashboard', 'admin',
      'users', 'posts', 'comments', 'feed', 'notifications', 'messages',
      'articles', 'news', 'events', 'gallery', 'portfolio', 'shop', 'cart',
      'checkout', 'payment', 'orders', 'shipping', 'returns', 'support',
      'faq', 'help', 'terms', 'privacy', 'legal', 'sitemap', 'archive',
      'category', 'tag', 'author', 'date', 'popular', 'trending', 'latest'
    ];
    
    const subpaths = [
      'view', 'edit', 'delete', 'create', 'update', 'list', 'detail',
      'page', 'section', 'item', 'post', 'article', 'thread', 'comment',
      'user', 'profile', 'account', 'settings', 'preferences', 'history',
      'new', 'old', 'archived', 'draft', 'published', 'pending', 'review'
    ];
    
    const queryParams = [
      'id', 'page', 'sort', 'filter', 'search', 'query', 'limit', 'offset',
      'category', 'tag', 'author', 'date', 'type', 'status', 'format'
    ];
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    const subpath = subpaths[Math.floor(Math.random() * subpaths.length)];
    const param = queryParams[Math.floor(Math.random() * queryParams.length)];
    const paramValue = Math.floor(Math.random() * 1000);
    
    // Generate varied URL patterns to increase collision probability
    const patterns = [
      `https://www.${domain}/${path}/${index}`,
      `https://${domain}/${path}/${subpath}/${index}`,
      `https://www.${domain}/${path}?${param}=${index}`,
      `https://${domain}/${path}/${subpath}?${param}=${paramValue}`,
      `https://api.${domain}/${path}/${index}`,
      `https://blog.${domain}/${path}/${subpath}/${index}`,
      `https://www.${domain}/v1/${path}/${index}`,
      `https://${domain}/${path}/${index}/${subpath}`,
      `https://www.${domain}/${path}/${index}?sort=desc&${param}=${paramValue}`,
      `https://${domain}/en/${path}/${subpath}/${index}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const addURL = () => {
    const url = generateURL(urlCount);
    
    // Measure Hash Set performance
    const hashStartTime = performance.now();
    const newHashSet = new Set(hashSet);
    newHashSet.add(url);
    const hashEndTime = performance.now();
    
    // Measure Bloom Filter performance
    const bloomStartTime = performance.now();
    bloomFilter.add(url);
    const bloomEndTime = performance.now();
    
    setHashSet(newHashSet);
    setUrlCount(urlCount + 1);
    
    setMetrics({
      hashSetTime: (hashEndTime - hashStartTime).toFixed(6),
      bloomFilterTime: (bloomEndTime - bloomStartTime).toFixed(6),
      hashSetMemory: (newHashSet.size * 100 / 1024 / 1024).toFixed(6), // Approx 100 bytes per URL
      bloomFilterMemory: bloomFilter.getMemoryUsage().toFixed(6)
    });
  };

  const testFalsePositives = () => {
    let fps = 0;
    const tests = 5000; // Increased from 1000 to 5000 for better statistics
    
    for (let i = 0; i < tests; i++) {
      // Generate completely new URLs that were never added
      const testUrl = generateURL(urlCount + 5000000 + i);
      if (bloomFilter.contains(testUrl) && !hashSet.has(testUrl)) {
        fps++;
      }
    }
    
    setTestResults({ falsePositives: fps, totalTests: tests });
  };

  const reset = () => {
    setHashSet(new Set());
    setBloomFilter(new BloomFilter(bloomFilterSize, numHashFunctions));
    setUrlCount(0);
    setTestResults({ falsePositives: 0, totalTests: 0 });
    setIsRunning(false);
    setShowConfigModal(true);
    setMetrics({
      hashSetTime: 0,
      bloomFilterTime: 0,
      hashSetMemory: 0,
      bloomFilterMemory: 0
    });
  };

  const handleBloomFilterSizeChange = (newSize) => {
    setBloomFilterSize(newSize);
    const newBloomFilter = new BloomFilter(newSize, numHashFunctions);
    setBloomFilter(newBloomFilter);
    setTestResults({ falsePositives: 0, totalTests: 0 });
  };

  const handleNumHashFunctionsChange = (newNum) => {
    setNumHashFunctions(newNum);
    const newBloomFilter = new BloomFilter(bloomFilterSize, newNum);
    setBloomFilter(newBloomFilter);
    setTestResults({ falsePositives: 0, totalTests: 0 });
  };

  const startSimulation = () => {
    setShowConfigModal(false);
  };

  const calculateExpectedFPR = (m, k, n) => {
    if (n === 0) return 0;
    return (Math.pow(1 - Math.exp(-k * n / m), k) * 100).toFixed(6);
  };

  useEffect(() => {
    let interval;
    if (isRunning && urlCount < 10000) {
      interval = setInterval(() => {
        addURL();
      }, 101 - speed);
    } else if (urlCount >= 10000) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, urlCount, speed]);

  const falsePositiveRate = (testResults.falsePositives / testResults.totalTests * 100).toFixed(6);
  const theoreticalFPR = (bloomFilter.getFalsePositiveRate() * 100).toFixed(6);
  
  // Calculate optimal hash functions
  const optimalHashFunctions = Math.round((bloomFilterSize / Math.max(urlCount, 1)) * Math.log(2));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      {/* Configuration Modal Overlay */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500/50">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Filter size={28} />
                Configure Bloom Filter
              </h2>
              <p className="text-purple-100 text-sm sm:text-base">
                Adjust the parameters to see how they affect false positive rates
              </p>
            </div>

            <div className="p-4 sm:p-8 space-y-6">
              {/* Bit Array Size Configuration */}
              <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-purple-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Bit Array Size (m)</h3>
                    <p className="text-purple-300 text-xs sm:text-sm">Larger size = Lower false positive rate, More memory</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-300">{bloomFilterSize.toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-purple-400">bits</div>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={bloomFilterSize}
                  onChange={(e) => handleBloomFilterSizeChange(Number(e.target.value))}
                  className="w-full h-4 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #8b5cf6 ${((bloomFilterSize - 10000) / (5000000 - 10000)) * 100}%, #4c1d95 ${((bloomFilterSize - 10000) / (5000000 - 10000)) * 100}%, #4c1d95 100%)`
                  }}
                />
                
                <div className="flex justify-between text-xs text-purple-300 mt-2">
                  <span>10K</span>
                  <span>1M</span>
                  <span>3M</span>
                  <span>5M</span>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-purple-900/40 rounded-lg p-3">
                    <div className="text-purple-300 text-xs mb-1">Memory Usage</div>
                    <div className="text-white font-bold text-base sm:text-lg">
                      {(bloomFilterSize / 8 / 1024 / 1024).toFixed(6)} MB
                    </div>
                  </div>
                  <div className="bg-purple-900/40 rounded-lg p-3">
                    <div className="text-purple-300 text-xs mb-1">Efficiency</div>
                    <div className="text-white font-bold text-base sm:text-lg">
                      {bloomFilterSize < 100000 ? '⭐ Very Low' : 
                       bloomFilterSize < 500000 ? '⭐⭐ Low' :
                       bloomFilterSize < 1000000 ? '⭐⭐⭐ Medium' :
                       bloomFilterSize < 2000000 ? '⭐⭐⭐⭐ High' : '⭐⭐⭐⭐⭐ Very High'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hash Functions Configuration */}
              <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-purple-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Number of Hash Functions (k)</h3>
                    <p className="text-purple-300 text-xs sm:text-sm">Optimal k minimizes false positive rate for given m and n</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-300">{numHashFunctions}</div>
                    <div className="text-xs sm:text-sm text-purple-400">functions</div>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={numHashFunctions}
                  onChange={(e) => handleNumHashFunctionsChange(Number(e.target.value))}
                  className="w-full h-4 bg-purple-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ec4899 0%, #8b5cf6 ${((numHashFunctions - 1) / 9) * 100}%, #4c1d95 ${((numHashFunctions - 1) / 9) * 100}%, #4c1d95 100%)`
                  }}
                />
                
                <div className="flex justify-between text-xs text-purple-300 mt-2">
                  <span>1</span>
                  <span>3</span>
                  <span>5</span>
                  <span>7</span>
                  <span>10</span>
                </div>

                <div className="mt-4 bg-blue-900/40 rounded-lg p-3">
                  <div className="text-blue-300 text-xs mb-1">💡 Recommendation</div>
                  <div className="text-white text-xs sm:text-sm">
                    For most cases, k=3 to k=5 provides good balance. 
                    Too few → higher FPR. Too many → slower insertions.
                  </div>
                </div>
              </div>

              {/* Expected Performance Preview */}
              <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 sm:p-6 border border-indigo-500/30">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">📊 Expected Performance Preview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[100, 1000, 5000].map((urls) => (
                    <div key={urls} className="bg-black/40 rounded-lg p-4">
                      <div className="text-purple-300 text-xs sm:text-sm font-semibold mb-2">
                        After {urls.toLocaleString()} URLs
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-white mb-1 font-mono">
                        {calculateExpectedFPR(bloomFilterSize, numHashFunctions, urls)}%
                      </div>
                      <div className="text-xs text-purple-400">Expected FPR</div>
                      <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-red-500"
                          style={{width: `${Math.min(calculateExpectedFPR(bloomFilterSize, numHashFunctions, urls), 100)}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="bg-black/30 rounded-xl p-4 sm:p-6 border border-purple-500/30">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">⚡ Quick Presets</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      handleBloomFilterSizeChange(50000);
                      handleNumHashFunctionsChange(2);
                    }}
                    className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl p-4 transition-all transform hover:scale-105 border border-red-400/30"
                  >
                    <div className="text-2xl mb-2">🔴</div>
                    <div className="font-bold mb-1">High FPR Demo</div>
                    <div className="text-xs opacity-90">50K bits, k=2</div>
                    <div className="text-xs mt-2 bg-black/30 rounded p-2 font-mono">
                      ~{calculateExpectedFPR(50000, 2, 1000)}% @ 1K URLs
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleBloomFilterSizeChange(500000);
                      handleNumHashFunctionsChange(3);
                    }}
                    className="bg-gradient-to-br from-yellow-600 to-orange-800 hover:from-yellow-500 hover:to-orange-700 text-white rounded-xl p-4 transition-all transform hover:scale-105 border border-yellow-400/30"
                  >
                    <div className="text-2xl mb-2">🟡</div>
                    <div className="font-bold mb-1">Balanced Demo</div>
                    <div className="text-xs opacity-90">500K bits, k=3</div>
                    <div className="text-xs mt-2 bg-black/30 rounded p-2 font-mono">
                      ~{calculateExpectedFPR(500000, 3, 1000)}% @ 1K URLs
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleBloomFilterSizeChange(2000000);
                      handleNumHashFunctionsChange(5);
                    }}
                    className="bg-gradient-to-br from-green-600 to-emerald-800 hover:from-green-500 hover:to-emerald-700 text-white rounded-xl p-4 transition-all transform hover:scale-105 border border-green-400/30"
                  >
                    <div className="text-2xl mb-2">🟢</div>
                    <div className="font-bold mb-1">Low FPR Demo</div>
                    <div className="text-xs opacity-90">2M bits, k=5</div>
                    <div className="text-xs mt-2 bg-black/30 rounded p-2 font-mono">
                      ~{calculateExpectedFPR(2000000, 5, 1000)}% @ 1K URLs
                    </div>
                  </button>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startSimulation}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg sm:text-xl font-bold py-4 sm:py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Play size={24} className="sm:w-7 sm:h-7" />
                Start Simulation with These Settings
              </button>

              {/* Info Footer */}
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
                <div className="text-blue-300 text-xs sm:text-sm">
                  <strong>💡 Tip:</strong> Start with the "High FPR Demo" preset to clearly see false positives, 
                  then try "Low FPR Demo" to see how increasing the bit array size improves accuracy.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Web Crawler URL Tracker
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 mb-2">Hash Set vs Bloom Filter Comparison</p>
          <p className="text-xs sm:text-sm text-purple-300">Roll No: 106124109, 106124019, 106124111</p>
        </div>

        {/* Bloom Filter Configuration Panel */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 border border-indigo-400/30">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Filter className="text-purple-400" size={24} className="sm:w-7 sm:h-7" />
            Bloom Filter Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bit Array Size Control */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-4">
                <label className="text-white font-semibold text-base sm:text-lg">Bit Array Size (m)</label>
                <span className="text-xl sm:text-2xl font-bold text-purple-300">{bloomFilterSize.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={bloomFilterSize}
                onChange={(e) => handleBloomFilterSizeChange(Number(e.target.value))}
                disabled={isRunning || urlCount > 0}
                className="w-full h-3 bg-purple-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-2">
                <span>10K (0.01 MB)</span>
                <span>5M (0.6 MB)</span>
              </div>
              <div className="mt-3 text-sm text-purple-200">
                <strong>Memory:</strong> {(bloomFilterSize / 8 / 1024 / 1024).toFixed(2)} MB
              </div>
              {(isRunning || urlCount > 0) && (
                <div className="mt-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                  ⚠️ Reset to change configuration
                </div>
              )}
            </div>

            {/* Hash Functions Control */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-4">
                <label className="text-white font-semibold text-base sm:text-lg">Hash Functions (k)</label>
                <span className="text-xl sm:text-2xl font-bold text-purple-300">{numHashFunctions}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={numHashFunctions}
                onChange={(e) => handleNumHashFunctionsChange(Number(e.target.value))}
                disabled={isRunning || urlCount > 0}
                className="w-full h-3 bg-purple-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-2">
                <span>1</span>
                <span>10</span>
              </div>
              <div className="mt-3 text-sm text-purple-200">
                <strong>Optimal k:</strong> {optimalHashFunctions} 
                <span className="text-xs ml-2">(based on current URLs)</span>
              </div>
              {(isRunning || urlCount > 0) && (
                <div className="mt-2 text-xs text-yellow-300 bg-yellow-900/20 p-2 rounded">
                  ⚠️ Reset to change configuration
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-purple-200 text-xs sm:text-sm mb-3">Quick Presets:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  handleBloomFilterSizeChange(50000);
                  handleNumHashFunctionsChange(2);
                }}
                disabled={isRunning || urlCount > 0}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500/30 hover:bg-red-500/50 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-400/30"
              >
                High FPR (50K, k=2)
              </button>
              <button
                onClick={() => {
                  handleBloomFilterSizeChange(500000);
                  handleNumHashFunctionsChange(3);
                }}
                disabled={isRunning || urlCount > 0}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500/30 hover:bg-yellow-500/50 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-400/30"
              >
                Medium FPR (500K, k=3)
              </button>
              <button
                onClick={() => {
                  handleBloomFilterSizeChange(2000000);
                  handleNumHashFunctionsChange(5);
                }}
                disabled={isRunning || urlCount > 0}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500/30 hover:bg-green-500/50 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-green-400/30"
              >
                Low FPR (2M, k=5)
              </button>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start w-full sm:w-auto">
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={urlCount >= 10000}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Start'} Simulation
              </button>
              <button
                onClick={addURL}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Add Single URL
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all shadow-lg"
              >
                <RotateCcw size={20} />
                Reset & Reconfigure
              </button>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
              <label className="text-white font-semibold text-sm sm:text-base">Speed:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full sm:w-32 flex-1 sm:flex-none"
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{urlCount.toLocaleString()}</div>
            <div className="text-purple-200 text-sm sm:text-base">URLs Processed</div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-center text-purple-200 text-xs sm:text-sm">
              <strong>Current Configuration:</strong> Bit Array = {bloomFilterSize.toLocaleString()} bits 
              ({(bloomFilterSize / 8 / 1024 / 1024).toFixed(6)} MB) | 
              Hash Functions = {numHashFunctions}
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Hash Set Card */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-green-400/30">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-green-400" size={28} className="sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Hash Set</h2>
                <p className="text-green-300 text-xs sm:text-sm">Perfect Accuracy</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="text-green-300" size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-green-200 font-semibold text-sm sm:text-base">Memory Usage</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{metrics.hashSetMemory} MB</div>
                <div className="text-xs sm:text-sm text-green-300 mt-1">~100 bytes per URL</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-green-300" size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-green-200 font-semibold text-sm sm:text-base">Insertion Time</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{metrics.hashSetTime} ms</div>
                <div className="text-xs sm:text-sm text-green-300 mt-1">O(1) average complexity</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-300" size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-green-200 font-semibold text-sm sm:text-base">Accuracy</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
                <div className="text-xs sm:text-sm text-green-300 mt-1">No false positives</div>
              </div>
            </div>
          </div>

          {/* Bloom Filter Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-purple-400/30">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="text-purple-400" size={28} className="sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Bloom Filter</h2>
                <p className="text-purple-300 text-xs sm:text-sm">Memory Efficient</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="text-purple-300" size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-purple-200 font-semibold text-sm sm:text-base">Memory Usage</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{metrics.bloomFilterMemory} MB</div>
                <div className="text-xs sm:text-sm text-purple-300 mt-1">
                  {bloomFilterSize.toLocaleString()} bits, {numHashFunctions} hash functions
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-300" size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-purple-200 font-semibold text-sm sm:text-base">Insertion Time</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{metrics.bloomFilterTime} ms</div>
                <div className="text-xs sm:text-sm text-purple-300 mt-1">O(k) where k = hash functions</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="text-purple-300" size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-purple-200 font-semibold text-sm sm:text-base">False Positive Rate</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{theoreticalFPR}%</div>
                <div className="text-xs sm:text-sm text-purple-300 mt-1">
                  Theoretical (n={urlCount.toLocaleString()})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* False Positive Testing */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">False Positive Testing</h3>
          <p className="text-purple-200 mb-4 text-sm sm:text-base">
            Test the Bloom Filter with 5,000 URLs not in the Hash Set to measure actual false positive rate.
            With more URL patterns and variations, the collision probability increases.
          </p>
          <button
            onClick={testFalsePositives}
            disabled={urlCount === 0}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Run False Positive Test
          </button>
          
          {testResults.totalTests > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-xs sm:text-sm mb-1">Tests Run</div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">{testResults.totalTests.toLocaleString()}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-xs sm:text-sm mb-1">False Positives</div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">{testResults.falsePositives.toLocaleString()}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-xs sm:text-sm mb-1">Actual FP Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">{falsePositiveRate}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-indigo-400/30">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white mb-4">
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-2 text-sm sm:text-base">✓ Hash Set Advantages</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-green-100">
                <li>• Perfect accuracy (0% false positives)</li>
                <li>• Simple implementation</li>
                <li>• Fast O(1) lookups and insertions</li>
              </ul>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-bold text-purple-400 mb-2 text-sm sm:text-base">✓ Bloom Filter Advantages</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-purple-100">
                <li>• Extremely memory efficient</li>
                <li>• Scalable to billions of URLs</li>
                <li>• Tunable false positive rate</li>
                <li>• Smaller size = Less memory, Higher FPR</li>
                <li>• More hash functions = Lower FPR, Slower</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4">
            <p className="text-purple-200 text-xs sm:text-sm">
              <strong>Trade-off Analysis:</strong> For 1 billion URLs, a Hash Set would require ~100 GB of memory 
              while a Bloom Filter needs only a few GB. With increased URL variety ({' '}
              <span className="text-yellow-300 font-semibold">
                34 domains, 45 paths, 27 subpaths, 10 URL patterns
              </span>
              ), we see more hash collisions leading to higher false positive rates.
            </p>
            <p className="text-purple-200 text-xs sm:text-sm mt-2">
              <strong>Current Settings:</strong> m={bloomFilterSize.toLocaleString()}, k={numHashFunctions}, n={urlCount.toLocaleString()} → 
              FPR ≈ {theoreticalFPR}%. 
              <span className="text-yellow-300"> Decrease 'm' or increase 'n' to see FPR rise!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLTrackerComparison;