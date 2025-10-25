class BloomFilter {
  constructor(size, numHashes) {
    this.size = size;
    this.numHashes = numHashes;
    this.bitArray = new Array(size).fill(0);
    this.itemCount = 0;
  }


  // hash = hash*31 + charcode 
  // this is a polynomial rolling hash with base 31
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
    return this.size / 8 / 1024 / 1024;
  }

  getFalsePositiveRate() {
    const m = this.size;
    const k = this.numHashes;
    const n = this.itemCount;
    return Math.pow(1 - Math.exp(-k * n / m), k);
  }
}

export default BloomFilter;