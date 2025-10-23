class CuckooFilter {
  constructor(capacity, bucketSize = 4, fingerprintSize = 8) {
    this.capacity = capacity;
    this.bucketSize = bucketSize;
    this.fingerprintSize = fingerprintSize;
    this.numBuckets = Math.ceil(capacity / bucketSize);
    this.buckets = Array.from({ length: this.numBuckets }, () => []);
    this.itemCount = 0;
    this.maxKicks = 500;
  }

  hash(str, seed = 0) {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  fingerprint(str) {
    return this.hash(str, 12345) % (1 << this.fingerprintSize);
  }

  getIndices(url) {
    const fp = this.fingerprint(url);
    const h1 = this.hash(url) % this.numBuckets;
    const h2 = (h1 ^ this.hash(fp.toString())) % this.numBuckets;
    return { fp, h1, h2 };
  }

  add(url) {
    const { fp, h1, h2 } = this.getIndices(url);
    
    if (this.buckets[h1].length < this.bucketSize) {
      this.buckets[h1].push(fp);
      this.itemCount++;
      return true;
    }
    
    if (this.buckets[h2].length < this.bucketSize) {
      this.buckets[h2].push(fp);
      this.itemCount++;
      return true;
    }
    
    let index = Math.random() < 0.5 ? h1 : h2;
    let currentFp = fp;
    
    for (let i = 0; i < this.maxKicks; i++) {
      const randomIdx = Math.floor(Math.random() * this.bucketSize);
      const temp = this.buckets[index][randomIdx];
      this.buckets[index][randomIdx] = currentFp;
      currentFp = temp;
      
      index = (index ^ this.hash(currentFp.toString())) % this.numBuckets;
      
      if (this.buckets[index].length < this.bucketSize) {
        this.buckets[index].push(currentFp);
        this.itemCount++;
        return true;
      }
    }
    
    this.itemCount++;
    return false;
  }

  contains(url) {
    const { fp, h1, h2 } = this.getIndices(url);
    return this.buckets[h1].includes(fp) || this.buckets[h2].includes(fp);
  }

  delete(url) {
    const { fp, h1, h2 } = this.getIndices(url);
    
    const idx1 = this.buckets[h1].indexOf(fp);
    if (idx1 !== -1) {
      this.buckets[h1].splice(idx1, 1);
      this.itemCount--;
      return true;
    }
    
    const idx2 = this.buckets[h2].indexOf(fp);
    if (idx2 !== -1) {
      this.buckets[h2].splice(idx2, 1);
      this.itemCount--;
      return true;
    }
    
    return false;
  }

  getMemoryUsage() {
    return (this.numBuckets * this.bucketSize * this.fingerprintSize) / 8 / 1024 / 1024;
  }

  getFalsePositiveRate() {
    const loadFactor = this.itemCount / (this.numBuckets * this.bucketSize);
    return 1 / (1 << this.fingerprintSize) * loadFactor;
  }
}

export default CuckooFilter;