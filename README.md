# Web Crawler URL Tracker: Hash Set vs Bloom Filter

##  Project Information

**Course:** Data Structures and Algorithms  
**Roll Numbers:** 106124109, 106124019, 106124111  
**Project Type:** Comparative Analysis & Interactive Visualization  

##  Project Overview

This project demonstrates and compares two fundamental approaches for tracking visited URLs in a web crawler:

1. **Hash Set** - Perfect accuracy with higher memory usage
2. **Bloom Filter** - Memory-efficient with probabilistic accuracy

The application provides real-time visualization of memory usage, insertion speed, and false positive rates, making it an excellent educational tool for understanding data structure trade-offs.

---

##  Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A code editor (VS Code recommended)

### Installation Methods

We provide three setup methods. Choose the one that works best for you:

---

## Method 1: React Application (Recommended)

This is the full-featured version with best performance.

### Step 1: Create React App
```bash
# Create a new React application
npx create-react-app web-crawler-tracker

# Navigate to the project directory
cd web-crawler-tracker
```

### Step 2: Install Dependencies
```bash
# Install required packages
npm install lucide-react

# Or if using yarn
yarn add lucide-react
```

### Step 3: Replace App.js

1. Open `src/App.js` in your code editor
2. Delete all existing content
3. Copy the entire React component code from the artifact
4. Save the file

### Step 4: Update Tailwind CSS (Optional but recommended)
```bash
# Install Tailwind CSS
npm install -D tailwindcss
npx tailwindcss init

# Or with yarn
yarn add -D tailwindcss
yarn tailwind init
```

Create/update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Run the Application
```bash
# Start the development server
npm start

# Or with yarn
yarn start
```

The application will automatically open in your browser at `http://localhost:3000`

---

## Method 2: Standalone HTML File

For a simpler setup without Node.js dependencies.

### Step 1: Create Project Directory
```bash
mkdir web-crawler-tracker
cd web-crawler-tracker
```

### Step 2: Create HTML File

Create a file named `index.html` and add the following:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Crawler URL Tracker</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // Paste the React component code here
    </script>
</body>
</html>
```

### Step 3: Open in Browser

Simply double-click `index.html` or open it with your browser.

**Note:** This method loads libraries from CDN, so an internet connection is required.

---

## Method 3: Vite (Faster Alternative)

Vite provides faster build times and hot module replacement.

### Step 1: Create Vite Project
```bash
# Create new Vite + React project
npm create vite@latest web-crawler-tracker -- --template react

# Navigate to directory
cd web-crawler-tracker
```

### Step 2: Install Dependencies
```bash
# Install dependencies
npm install

# Install additional packages
npm install lucide-react
```

### Step 3: Setup Tailwind CSS
```bash
# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Replace App.jsx

Replace the content of `src/App.jsx` with the component code.

### Step 5: Run Development Server
```bash
npm run dev
```

Visit the URL shown in terminal (usually `http://localhost:5173`)

---

##  Project Structure
```
web-crawler-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # Entry point
│   ├── index.css           # Tailwind styles
│   └── components/         # (Optional) Additional components
├── package.json
├── README.md
└── tailwind.config.js
```

---

##  How to Use the Application

### Basic Operations

1. **Start Simulation**
   - Click "Start Simulation" to automatically add URLs
   - Watch real-time metrics update
   - URLs are added based on the speed slider setting

2. **Manual Control**
   - Use "Add Single URL" to add one URL at a time
   - Observe individual insertion performance

3. **Speed Control**
   - Adjust the speed slider (1-100)
   - Higher values = faster URL insertion

4. **False Positive Testing**
   - After adding URLs, click "Run False Positive Test"
   - Tests 1,000 new URLs against both data structures
   - Displays actual vs theoretical false positive rates

5. **Reset**
   - Click "Reset" to clear all data and start fresh

### Understanding the Metrics

#### Hash Set Panel (Green)
- **Memory Usage**: Shows RAM consumed (grows with URL count)
- **Insertion Time**: Time taken to add each URL (in milliseconds)
- **Accuracy**: Always 100% - no false positives

#### Bloom Filter Panel (Purple)
- **Memory Usage**: Fixed size (~1.19 MB regardless of URL count)
- **Insertion Time**: Time for k hash computations
- **False Positive Rate**: Probability of incorrect "visited" response

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: "npm: command not found"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

#### Issue: Port 3000 already in use
**Solution:** 
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or specify a different port
PORT=3001 npm start
```

#### Issue: Tailwind styles not working
**Solution:**
```bash
# Reinstall Tailwind
npm uninstall tailwindcss
npm install -D tailwindcss
npx tailwindcss init
```

#### Issue: Icons not displaying
**Solution:**
```bash
# Reinstall lucide-react
npm install lucide-react
```

#### Issue: Application runs slow with many URLs
**Solution:** This is expected behavior demonstrating the performance characteristics. Consider:
- Reducing simulation speed
- Resetting at 10,000 URLs
- Using a more powerful device

---

##  Testing Scenarios

### Recommended Test Cases

1. **Small Scale Test (100 URLs)**
   - Observe minimal memory difference
   - Both structures perform similarly

2. **Medium Scale Test (1,000 URLs)**
   - Memory difference becomes noticeable
   - Run false positive test

3. **Large Scale Test (10,000 URLs)**
   - Significant memory difference
   - Hash Set: ~0.95 MB
   - Bloom Filter: ~1.19 MB (fixed)

4. **Performance Comparison**
   - Add URLs manually one at a time
   - Compare insertion times between structures

---

##  Educational Value

### Learning Objectives

Students will understand:

1. **Trade-offs in Data Structures**
   - Space complexity vs Time complexity
   - Accuracy vs Efficiency

2. **Probabilistic Data Structures**
   - How Bloom Filters work
   - Hash function applications
   - False positive rate calculations

3. **Real-world Applications**
   - Web crawling at scale
   - Database systems
   - Cache implementations
   - Network routing

### Presentation Tips

1. **Start with the problem**: Explain why tracking billions of URLs is challenging
2. **Demo Hash Set first**: Show the accuracy benefit
3. **Introduce Bloom Filter**: Demonstrate memory efficiency
4. **Run live tests**: Show false positive testing
5. **Discuss trade-offs**: When to use each approach

---

##  Technical Details

### Hash Set Implementation
- **Data Structure**: JavaScript Set object
- **Time Complexity**: O(1) average for insert and lookup
- **Space Complexity**: O(n) where n = number of URLs
- **Memory per URL**: ~100 bytes

### Bloom Filter Implementation
- **Bit Array Size**: 1,000,000 bits (1 MB)
- **Hash Functions**: 3 independent hash functions
- **Time Complexity**: O(k) where k = number of hash functions
- **Space Complexity**: O(m) where m = bit array size (constant)

### False Positive Rate Formula
```
FPR = (1 - e^(-k*n/m))^k

Where:
k = number of hash functions (3)
n = number of items inserted
m = size of bit array (1,000,000)
```

---

##  Experiment Ideas

### Extensions and Modifications

1. **Adjustable Bloom Filter Parameters**
   - Add UI controls for bit array size
   - Allow changing number of hash functions
   - Observe FPR changes

2. **Comparison with Other Structures**
   - Add Binary Search Tree implementation
   - Compare with Trie structure

3. **Real URL Data**
   - Import actual web crawl data
   - Test with real-world URL patterns

4. **Performance Graphs**
   - Add charts using Recharts library
   - Visualize memory growth over time
   - Plot FPR vs URL count

---

##  References and Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Bloom Filter Theory](https://en.wikipedia.org/wiki/Bloom_filter)

### Research Papers
- Burton H. Bloom (1970): "Space/Time Trade-offs in Hash Coding with Allowable Errors"

### Additional Reading
- "Algorithms" by Robert Sedgewick
- "Introduction to Algorithms" by CLRS

---

##  Contributing

This is an academic project. If you'd like to enhance it:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request with detailed description

---

##  License

This project is created for educational purposes as part of a Data Structures course.

---

##  Team Members

- Roll No: 106124109
- Roll No: 106124019
- Roll No: 106124111

---

##  Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the documentation
3. Contact your course instructor
4. Post in the course discussion forum

---

##  Acknowledgments

- Course instructors for project guidance
- React and Tailwind CSS communities
- Open-source contributors

---

**Happy Learning! 🚀**

*Last Updated: October 2025*
# Web Crawler URL Tracker: Hash Set vs Bloom Filter

