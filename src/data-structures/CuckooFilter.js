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

  // hash = hash * 31 + charcode
  // polynomial rolling hash with base 31 // same as bloom filter
  hash(str, seed = 0) {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  //we are using the same hash function but this time we are taking mod with 8 so that we will be left with 8 bit long fingerprint
  // this return the number
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
    
    //select the any of two bucket to kick out any random element 
    let index = Math.random() < 0.5 ? h1 : h2;
    let currentFp = fp;
    
    for (let i = 0; i < this.maxKicks; i++) {
      // for selection the random elem in the bucket 
      const randomIdx = Math.floor(Math.random() * this.bucketSize);

      const temp = this.buckets[index][randomIdx];
      this.buckets[index][randomIdx] = currentFp;
      currentFp = temp;
      
      // check the second bucket of the temporary  element if it is having space or not 

      //n1 = 2 , let 3 as the hash value we got corrsponding to fingerprint , now for getting n2 , n2 = 2^3
       index = (index ^ this.hash(currentFp.toString())) % this.numBuckets;
      
      if (this.buckets[index].length < this.bucketSize) {
        this.buckets[index].push(currentFp);
        this.itemCount++;
        return true;
      }
    }
    
    // after failure , itemcount should not increase 
    // this.itemCount++;
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
    return (1 / (1 << this.fingerprintSize) )* loadFactor*2*this.bucketSize;
  }

  getLoadFactor(){
    return this.itemCount / (this.numBuckets * this.bucketSize);
  }
}

export default CuckooFilter;