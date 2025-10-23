class CountMinSketch {
  constructor(width, depth) {
    this.width = width;
    this.depth = depth;
    this.table = Array.from({ length: depth }, () => new Array(width).fill(0));
    this.totalCount = 0;
  }

  hash(str, seed) {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % this.width;
  }

  add(url, count = 1) {
    for (let i = 0; i < this.depth; i++) {
      const index = this.hash(url, i);
      this.table[i][index] += count;
    }
    this.totalCount += count;
  }

  estimate(url) {
    let min = Infinity;
    for (let i = 0; i < this.depth; i++) {
      const index = this.hash(url, i);
      min = Math.min(min, this.table[i][index]);
    }
    return min;
  }

  getMemoryUsage() {
    return (this.width * this.depth * 4) / 1024 / 1024; // 4 bytes per counter
  }

  getAverageError() {
    return this.totalCount / this.width;
  }

  getFalsePositiveRate() {
    const collisionProb = 1 - Math.exp(-this.totalCount / this.width);
    return Math.pow(collisionProb, this.depth);
  }
}

export default CountMinSketch;