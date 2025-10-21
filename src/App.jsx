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
  const [bloomFilter, setBloomFilter] = useState(new BloomFilter(1000000, 3));
  const [urlCount, setUrlCount] = useState(0);
  const [testResults, setTestResults] = useState({ falsePositives: 0, totalTests: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [metrics, setMetrics] = useState({
    hashSetTime: 0,
    bloomFilterTime: 0,
    hashSetMemory: 0,
    bloomFilterMemory: 0
  });

  const generateURL = (index) => {
    const domains = ['example.com', 'test.org', 'demo.net', 'site.io', 'web.dev'];
    const paths = ['blog', 'api', 'docs', 'about', 'contact', 'products', 'services'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    return `https://www.${domain}/${path}/${index}`;
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
      hashSetTime: (hashEndTime - hashStartTime).toFixed(4),
      bloomFilterTime: (bloomEndTime - bloomStartTime).toFixed(4),
      hashSetMemory: (newHashSet.size * 100 / 1024 / 1024).toFixed(2), // Approx 100 bytes per URL
      bloomFilterMemory: bloomFilter.getMemoryUsage().toFixed(2)
    });
  };

  const testFalsePositives = () => {
    let fps = 0;
    const tests = 1000;
    
    for (let i = 0; i < tests; i++) {
      const testUrl = generateURL(urlCount + 1000000 + i);
      if (bloomFilter.contains(testUrl) && !hashSet.has(testUrl)) {
        fps++;
      }
    }
    
    setTestResults({ falsePositives: fps, totalTests: tests });
  };

  const reset = () => {
    setHashSet(new Set());
    setBloomFilter(new BloomFilter(1000000, 3));
    setUrlCount(0);
    setTestResults({ falsePositives: 0, totalTests: 0 });
    setIsRunning(false);
    setMetrics({
      hashSetTime: 0,
      bloomFilterTime: 0,
      hashSetMemory: 0,
      bloomFilterMemory: 0
    });
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

  const falsePositiveRate = (testResults.falsePositives / testResults.totalTests * 100).toFixed(2);
  const theoreticalFPR = (bloomFilter.getFalsePositiveRate() * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Web Crawler URL Tracker
          </h1>
          <p className="text-xl text-purple-200 mb-2">Hash Set vs Bloom Filter Comparison</p>
          <p className="text-sm text-purple-300">Roll No: 106124109, 106124019, 106124111</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={urlCount >= 10000}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Start'} Simulation
              </button>
              <button
                onClick={addURL}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Add Single URL
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all shadow-lg"
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

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Hash Set Card */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30">
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-green-400" size={32} />
              <h2 className="text-2xl font-bold text-white">Hash Set</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="text-green-300" size={20} />
                  <span className="text-green-200 font-semibold">Memory Usage</span>
                </div>
                <div className="text-3xl font-bold text-white">{metrics.hashSetMemory} MB</div>
                <div className="text-sm text-green-300 mt-1">~100 bytes per URL</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-green-300" size={20} />
                  <span className="text-green-200 font-semibold">Insertion Time</span>
                </div>
                <div className="text-3xl font-bold text-white">{metrics.hashSetTime} ms</div>
                <div className="text-sm text-green-300 mt-1">O(1) average complexity</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-300" size={20} />
                  <span className="text-green-200 font-semibold">Accuracy</span>
                </div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-green-300 mt-1">No false positives</div>
              </div>
            </div>
          </div>

          {/* Bloom Filter Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="text-purple-400" size={32} />
              <h2 className="text-2xl font-bold text-white">Bloom Filter</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="text-purple-300" size={20} />
                  <span className="text-purple-200 font-semibold">Memory Usage</span>
                </div>
                <div className="text-3xl font-bold text-white">{metrics.bloomFilterMemory} MB</div>
                <div className="text-sm text-purple-300 mt-1">1M bit array, 3 hash functions</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-300" size={20} />
                  <span className="text-purple-200 font-semibold">Insertion Time</span>
                </div>
                <div className="text-3xl font-bold text-white">{metrics.bloomFilterTime} ms</div>
                <div className="text-sm text-purple-300 mt-1">O(k) where k = hash functions</div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="text-purple-300" size={20} />
                  <span className="text-purple-200 font-semibold">False Positive Rate</span>
                </div>
                <div className="text-3xl font-bold text-white">{theoreticalFPR}%</div>
                <div className="text-sm text-purple-300 mt-1">Theoretical (formula-based)</div>
              </div>
            </div>
          </div>
        </div>

        {/* False Positive Testing */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">False Positive Testing</h3>
          <p className="text-purple-200 mb-4">
            Test the Bloom Filter with 1,000 URLs not in the Hash Set to measure actual false positive rate.
          </p>
          <button
            onClick={testFalsePositives}
            disabled={urlCount === 0}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Run False Positive Test
          </button>
          
          {testResults.totalTests > 0 && (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-sm mb-1">Tests Run</div>
                <div className="text-2xl font-bold text-white">{testResults.totalTests}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-sm mb-1">False Positives</div>
                <div className="text-2xl font-bold text-white">{testResults.falsePositives}</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="text-purple-200 text-sm mb-1">Actual FP Rate</div>
                <div className="text-2xl font-bold text-white">{falsePositiveRate}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-indigo-400/30">
          <h3 className="text-2xl font-bold text-white mb-4">Key Insights</h3>
          <div className="grid md:grid-cols-2 gap-4 text-white">
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-2">✓ Hash Set Advantages</h4>
              <ul className="space-y-1 text-sm text-green-100">
                <li>• Perfect accuracy (0% false positives)</li>
                <li>• Simple implementation</li>
                <li>• Fast O(1) lookups and insertions</li>
              </ul>
            </div>
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-bold text-purple-400 mb-2">✓ Bloom Filter Advantages</h4>
              <ul className="space-y-1 text-sm text-purple-100">
                <li>• Extremely memory efficient</li>
                <li>• Scalable to billions of URLs</li>
                <li>• Tunable false positive rate</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 bg-black/20 rounded-lg p-4">
            <p className="text-purple-200 text-sm">
              <strong>Trade-off Analysis:</strong> For 1 billion URLs, a Hash Set would require ~100 GB of memory 
              while a Bloom Filter needs only a few GB. The Bloom Filter's small false positive rate 
              ({theoreticalFPR}% with current settings) is acceptable for most web crawling applications, 
              making it the preferred choice for large-scale systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLTrackerComparison;