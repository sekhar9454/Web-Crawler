import React, { useState, useEffect } from 'react';
import BloomFilter from './data-structures/BloomFilter';
import CuckooFilter from './data-structures/CuckooFilter';
import CountMinSketch from './data-structures/CountMinSketch';
import ConfigModal from './components/ConfigModal';
import ControlPanel from './components/ControlPanel';
import ComparisonGrid from './components/ComparisonGrid';
import FalsePositiveTesting from './components/FalsePositiveTesting';
import ProsAndCons from './components/ProsAndCons';
import KeyInsights from './components/KeyInsights';
import UseCaseRecommendations from './components/UseCaseRecommendations';

const App = () => {
  const [hashSet, setHashSet] = useState(new Set());
  const [bloomFilterSize, setBloomFilterSize] = useState(1000000);
  const [numHashFunctions, setNumHashFunctions] = useState(3);
  const [bloomFilter, setBloomFilter] = useState(new BloomFilter(1000000, 3));
  
  const [cuckooCapacity, setCuckooCapacity] = useState(10000);
  const [cuckooBucketSize, setCuckooBucketSize] = useState(4);
  const [cuckooFilter, setCuckooFilter] = useState(new CuckooFilter(10000, 4));
  
  const [cmsWidth, setCmsWidth] = useState(10000);
  const [cmsDepth, setCmsDepth] = useState(5);
  const [countMinSketch, setCountMinSketch] = useState(new CountMinSketch(10000, 5));
  
  const [urlCount, setUrlCount] = useState(0);
  const [testResults, setTestResults] = useState({ 
    bloomFP: 0, 
    cuckooFP: 0,
    cmsFP: 0,
    totalTests: 0 
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [showConfigModal, setShowConfigModal] = useState(true);
  const [metrics, setMetrics] = useState({
    hashSetTime: 0,
    bloomFilterTime: 0,
    cuckooFilterTime: 0,
    countMinSketchTime: 0,
    hashSetMemory: 0,
    bloomFilterMemory: 0,
    cuckooFilterMemory: 0,
    countMinSketchMemory: 0
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
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    
    const patterns = [
      `https://www.${domain}/${path}/${index}`,
      `https://${domain}/${path}?id=${index}`,
      `https://api.${domain}/${path}/${index}`,
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const addURL = () => {
    const url = generateURL(urlCount);
    
    const hashStartTime = performance.now();
    const newHashSet = new Set(hashSet);
    newHashSet.add(url);
    const hashEndTime = performance.now();
    
    const bloomStartTime = performance.now();
    bloomFilter.add(url);
    const bloomEndTime = performance.now();
    
    const cuckooStartTime = performance.now();
    cuckooFilter.add(url);
    const cuckooEndTime = performance.now();
    
    const cmsStartTime = performance.now();
    countMinSketch.add(url);
    const cmsEndTime = performance.now();
    
    setHashSet(newHashSet);
    setUrlCount(urlCount + 1);
    
    setMetrics({
      hashSetTime: (hashEndTime - hashStartTime).toFixed(6),
      bloomFilterTime: (bloomEndTime - bloomStartTime).toFixed(6),
      cuckooFilterTime: (cuckooEndTime - cuckooStartTime).toFixed(6),
      countMinSketchTime: (cmsEndTime - cmsStartTime).toFixed(6),
      hashSetMemory: (newHashSet.size * 100 / 1024 / 1024).toFixed(6),
      bloomFilterMemory: bloomFilter.getMemoryUsage().toFixed(6),
      cuckooFilterMemory: cuckooFilter.getMemoryUsage().toFixed(6),
      countMinSketchMemory: countMinSketch.getMemoryUsage().toFixed(6)
    });
  };

  const testFalsePositives = () => {
    let bloomFPs = 0;
    let cuckooFPs = 0;
    let cmsFPs = 0;
    const tests = 5000;
    
    for (let i = 0; i < tests; i++) {
      const testUrl = generateURL(urlCount + 5000000 + i);
      if (bloomFilter.contains(testUrl) && !hashSet.has(testUrl)) {
        bloomFPs++;
      }
      if (cuckooFilter.contains(testUrl) && !hashSet.has(testUrl)) {
        cuckooFPs++;
      }
      if (countMinSketch.estimate(testUrl) > 0 && !hashSet.has(testUrl)) {
        cmsFPs++;
      }
    }
    
    setTestResults({ 
      bloomFP: bloomFPs, 
      cuckooFP: cuckooFPs,
      cmsFP: cmsFPs,
      totalTests: tests 
    });
  };

  const reset = () => {
    setHashSet(new Set());
    setBloomFilter(new BloomFilter(bloomFilterSize, numHashFunctions));
    setCuckooFilter(new CuckooFilter(cuckooCapacity, cuckooBucketSize));
    setCountMinSketch(new CountMinSketch(cmsWidth, cmsDepth));
    setUrlCount(0);
    setTestResults({ bloomFP: 0, cuckooFP: 0, cmsFP: 0, totalTests: 0 });
    setIsRunning(false);
    setShowConfigModal(true);
    setMetrics({
      hashSetTime: 0,
      bloomFilterTime: 0,
      cuckooFilterTime: 0,
      countMinSketchTime: 0,
      hashSetMemory: 0,
      bloomFilterMemory: 0,
      cuckooFilterMemory: 0,
      countMinSketchMemory: 0
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

  const bloomFPR = (testResults.bloomFP / testResults.totalTests * 100).toFixed(6);
  const cuckooFPR = (testResults.cuckooFP / testResults.totalTests * 100).toFixed(6);
  const cmsFPR = (testResults.cmsFP / testResults.totalTests * 100).toFixed(6);
  const theoreticalBloomFPR = (bloomFilter.getFalsePositiveRate() * 100).toFixed(6);
  const theoreticalCuckooFPR = (cuckooFilter.getFalsePositiveRate() * 100).toFixed(6);
  const theoreticalCountMinFPR = (countMinSketch.getFalsePositiveRate() * 100).toFixed(6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <ConfigModal
        showConfigModal={showConfigModal}
        setShowConfigModal={setShowConfigModal}
        bloomFilterSize={bloomFilterSize}
        setBloomFilterSize={setBloomFilterSize}
        numHashFunctions={numHashFunctions}
        setNumHashFunctions={setNumHashFunctions}
        cuckooCapacity={cuckooCapacity}
        setCuckooCapacity={setCuckooCapacity}
        cuckooBucketSize={cuckooBucketSize}
        setCuckooBucketSize={setCuckooBucketSize}
        cmsWidth={cmsWidth}
        setCmsWidth={setCmsWidth}
        cmsDepth={cmsDepth}
        setCmsDepth={setCmsDepth}
        setBloomFilter={setBloomFilter}
        setCuckooFilter={setCuckooFilter}
        setCountMinSketch={setCountMinSketch}
        BloomFilter={BloomFilter}
        CuckooFilter={CuckooFilter}
        CountMinSketch={CountMinSketch}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            4-Way URL Tracker Comparison
          </h1>
          <p className="text-xl text-purple-200 mb-2">Hash Map • Bloom Filter • Cuckoo Filter • Count-Min Sketch</p>
          <p className="text-sm text-purple-300">
            Sanskar Sharma (106124109) • Anshul Marathe (106124019) • Sarvesh (106124111)
          </p>
        </div>

        <ControlPanel
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          urlCount={urlCount}
          reset={reset}
          speed={speed}
          setSpeed={setSpeed}
        />

        <ComparisonGrid
          metrics={metrics}
          countMinSketch={countMinSketch}
          theoreticalBloomFPR={theoreticalBloomFPR}
          theoreticalCuckooFPR={theoreticalCuckooFPR}
          theoreticalCountMinFPR={theoreticalCountMinFPR}
        />

        <FalsePositiveTesting
          testFalsePositives={testFalsePositives}
          urlCount={urlCount}
          testResults={testResults}
          bloomFPR={bloomFPR}
          cuckooFPR={cuckooFPR}
          cmsFPR={cmsFPR}
        />

        <ProsAndCons />
        <KeyInsights />
        <UseCaseRecommendations />
      </div>
    </div>
  );
};

export default App;

