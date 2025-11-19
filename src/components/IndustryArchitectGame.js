
"use client";
import React, { useState, useMemo, useEffect } from 'react';

// --- INLINE SVG ICONS ---
// Using self-contained SVG components to ensure portability.
const IconHome = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" {...props}><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.94-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300.11L295.63 148.26a12.19 12.19 0 0 0-15.26 0zM571.6 251.47L488 182.58V44.05a12 12 0 0 0-12-12h-40a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l225.2-185.2a12 12 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg>
);
const IconIndustry = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" {...props}><path d="M480 320h-48v-96h48v96zm-128 0h-48v-96h48v96zm-128 0H176v-96h48v96zm-128 0H48v-96h48v96zm432 64H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zM480 48L320 224h160V48zM288 112L128 224h160V112zM96 224H0V48c0-17.67 14.33-32 32-32h96l128 96H96v112z"></path></svg>
);
const IconWater = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" {...props}><path d="M192 512C86 512 0 426 0 320C0 228.8 123.3 120.8 192 0c68.7 120.8 192 228.8 192 320c0 106-86 192-192 192zM128 352c0-35.3 28.7-64 64-64s64 28.7 64 64c0 35.3-28.7 64-64 64s-64-28.7-64-64z"></path></svg>
);
const IconCity = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" {...props}><path d="M608 32H32C14.33 32 0 46.33 0 64v384c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zM368 224H272v-96h96v96zm176 160h-96v-96h96v96zm0-160h-96v-96h96v96zM208 80h-96v96h96V80zm0 160h-96v96h96v-96zm0 160h-96v96h96v-96z"></path></svg>
);
const IconBolt = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" {...props}><path d="M368 256L160 0v192H32l208 320v-192h128z"></path></svg>
);
const IconCarrot = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" {...props}><path d="M352 224c0 44.18-35.82 80-80 80s-80-35.82-80-80 35.82-80 80-80 80 35.82 80 80zM503.7 192C485.4 136.2 433.8 96 368 96c-48.79 0-89.28 27.28-112 64-22.72-36.72-63.21-64-112-64-65.84 0-117.4 40.2-135.7 96H0v128h512v-128h-8.3zM448 352H64v-64h384v64z"></path></svg>
);
const IconMountain = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" {...props}><path d="M634.91 421.31L531.63 238.7a47.99 47.99 0 0 0-83.29 0l-57.22 101.52-39.69-70.4a48.03 48.03 0 0 0-83.31 0L160 421.31l-34.91-23.28a8 8 0 0 0-11.8.84l-23.31 35a8 8 0 0 0 3.38 12.31l38.29 25.53a8 8 0 0 0 8.42 0l38.29-25.53a8 8 0 0 0-3.38-12.31L168 410.72l99.6-176.59 51.5 91.35a15.95 15.95 0 0 0 13.88 7.84 16.03 16.03 0 0 0 13.89-8.08l60.2-106.82 87.25 154.79 32-21.33a8 8 0 0 0-11.8-11.8l-18.1 12.06L429.61 113.3a16 16 0 0 0-27.76 0L121.72 458.72a8 8 0 0 0 3.38 12.31l38.29 25.53a8 8 0 0 0 8.42 0l38.29-25.53a8 8 0 0 0-3.38-12.31L171.82 438l280.12-186.75 64.63 114.67-27.18 18.12a8 8 0 0 0-3.38 12.31l23.31 35a8 8 0 0 0 11.8.84l34.91-23.28a8 8 0 0 0 3.38-12.31l-38.29-25.53a8 8 0 0 0-8.42 0l-38.29 25.53a8 8 0 0 0 3.38 12.31L611.19 448l23.72-39.53a8 8 0 0 0-3.38-12.31L593.23 472l-28.32-18.88z"></path></svg>
);
const IconLeaf = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" {...props}><path d="M546.2 9.7c-6.9-12-22.3-16-34.3-9.1L21.2 255.4C9.2 262.3 4.2 277.7 11.1 289.7s22.3 16 34.3 9.1l511.7-244.8c12-6.9 16-22.3 9.1-34.3zM21.2 255.4l244.8-511.7c6.9-12 22.3-16 34.3-9.1s16 22.3 9.1 34.3L64.6 273.7c-6.9 12-22.3 16-34.3 9.1-12-6.9-16-22.3-9.1-34.3z"></path></svg>
);
const IconTractor = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" {...props}><path d="M624 320h-48v-48c0-17.67-14.33-32-32-32H352v-80c0-17.67-14.33-32-32-32H16c-8.84 0-16 7.16-16 16v240c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16v-80h131.55c3.38 42.84 39.73 76.58 84.45 76.58 46.33 0 84.03-39.52 84.44-88.31l132.84.31c26.51 0 48-21.49 48-48v-32c0-26.51-21.49-48-48-48zM128 352c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm256 0c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80z"></path></svg>
);
const IconGem = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" {...props}><path d="M560 176c0-26.51-21.49-48-48-48H320v112h240V176zM0 128C0 57.31 57.31 0 128 0h320c70.69 0 128 57.31 128 128v256c0 70.69-57.31 128-128 128H128C57.31 512 0 454.69 0 384V128zm256 224H64V176h192v176z"></path></svg>
);
const IconLaptop = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" {...props}><path d="M624 416H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h608c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM576 48c0-26.51-21.49-48-48-48H112C85.49 0 64 21.49 64 48v336h512V48z"></path></svg>
);
const IconPlane = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" {...props}><path d="M448 224h-64v-88c0-35.3-28.7-64-64-64h-32V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v40h-32c-35.3 0-64 28.7-64 64v88H64c-35.3 0-64 28.7-64 64v128c0 17.7 14.3 32 32 32s32-14.3 32-32v-32h384v32c0 17.7 14.3 32 32 32s32-14.3 32-32V288c0-35.3-28.7-64-64-64zM96 288c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm320 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg>
);
const IconCar = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" {...props}><path d="M499.99 176h-59.87l-16.64-41.6C406.38 80.47 364.25 48 313.62 48H198.38c-50.63 0-92.76 32.47-109.86 86.4L71.87 176H12.01C4.24 176-1.88 182.74.39 190.15l50.07 181.64C55.2 392.04 66.36 400 78.07 400h44.37c10.89 0 20.5-7.23 23.3-17.69l12.82-47.31h185.32l12.82 47.31c2.8 10.46 12.41 17.69 23.3 17.69h44.37c11.71 0 22.87-7.96 27.6-18.21l50.07-181.64c2.27-7.41-3.85-14.15-11.62-14.15zM128 320c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm256 0c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zM175.33 144.15C179.91 133.58 188.7 128 198.38 128h115.24c9.68 0 18.47 5.58 23.05 16.15L352 176H160l15.33-31.85z"></path></svg>
);
const IconFish = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" {...props}><path d="M569.5 212.4C553.3 203.2 529 192 496 192c-20.4 0-39.2 4.3-56 12.2V144c0-23.4-15.3-43.9-37.5-50.8L288 64l-9.5 3.8C256.2 74.1 240.9 94.6 240.9 118v16.2c-16.8-7.9-35.6-12.2-56-12.2-33 0-57.3 11.2-73.5 20.4-16.4 9.4-28.5 22.1-28.5 37.6 0 16.8 13.2 30.8 30.5 39.3-5.3 4.5-10.2 9.5-14.4 15.1-13.7 18.2-19.1 40-12.4 61.5 6.7 21.5 23.2 38.6 44.5 45.1 1.5 12.5 5.2 24.3 10.7 35.1-12.1 8.8-21.7 20.8-26.6 34.6-5.2 14.4-2.8 30.2 6.6 42.8 9.3 12.5 24.1 19.8 39.8 19.8 20.4 0 38.2-11.8 46.5-29.4 8.2 1.3 16.7 2 25.5 2 8.8 0 17.3-.7 25.5-2 8.3 17.6 26.1 29.4 46.5 29.4 15.7 0 30.5-7.3 39.8-19.8 9.4-12.6 11.8-28.4 6.6-42.8-4.9-13.8-14.5-25.8-26.6-34.6 5.5-10.8 9.2-22.6 10.7-35.1 21.3-6.5 37.8-23.6 44.5-45.1 6.7-21.5 1.3-43.3-12.4-61.5-4.2-5.6-9.1-10.6-14.4-15.1 17.3-8.5 30.5-22.5 30.5-39.3.1-15.5-12-28.2-28.5-37.6zM241 256c0-26.5 21.5-48 48-48s48 21.5 48 48-21.5 48-48 48-48-21.5-48-48z"></path></svg>
);


// --- Game Data: Expanded levels for all of India ---
const levels = [
  {
    mission: "India has high sugarcane production in the northern plains. Find the best location for a new sugar mill.",
    industryType: 'agro-based',
    explanation: "Agro-based industries like sugar mills are best located near the raw material (sugarcane) because it's bulky and loses its sucrose content quickly after harvesting.",
    mapImage: "/india.png",
    resources: [
      { type: 'raw_material', name: 'Sugarcane Fields (Punjab)', x: 35, y: 22, weight: 10, icon: <IconCarrot /> },
      { type: 'water', name: 'Sutlej River', x: 33, y: 20, weight: 3, icon: <IconWater /> },
      { type: 'labor', name: 'Ludhiana', x: 36, y: 21, weight: 2, icon: <IconCity /> },
      { type: 'power', name: 'Power Plant', x: 32, y: 25, weight: 1, icon: <IconBolt /> },
    ]
  },
  {
    mission: "The Chota Nagpur Plateau is rich in minerals. Find the optimal location for a major steel plant.",
    industryType: 'mineral-based',
    explanation: "Steel plants require a balance between iron ore, coal (for energy), and a water source. Proximity to all three is key to minimizing transport costs.",
    mapImage: "/india.png",
    resources: [
      { type: 'raw_material', name: 'Iron Ore Mines (Odisha)', x: 68, y: 58, weight: 8, icon: <IconMountain /> },
      { type: 'energy', name: 'Coal Fields (Jharkhand)', x: 70, y: 50, weight: 8, icon: <IconGem /> },
      { type: 'water', name: 'Mahanadi River', x: 67, y: 60, weight: 4, icon: <IconWater /> },
      { type: 'labor', name: 'Jamshedpur', x: 71, y: 52, weight: 2, icon: <IconCity /> },
    ]
  },
  {
    mission: "Assam is famous for its tea. Where should you establish a tea processing factory?",
    industryType: 'agro-based',
    explanation: "Tea processing must be done very close to the tea gardens to prevent the leaves from wilting and losing their flavour and aroma.",
    mapImage: "/india.png",
    resources: [
      { type: 'raw_material', name: 'Tea Gardens (Assam)', x: 90, y: 35, weight: 12, icon: <IconLeaf /> },
      { type: 'water', name: 'Brahmaputra River', x: 88, y: 33, weight: 3, icon: <IconWater /> },
      { type: 'labor', name: 'Guwahati', x: 86, y: 36, weight: 2, icon: <IconCity /> },
    ]
  },
   {
    mission: "Western India is a major cotton-growing region. Find the best location for a new cotton textile mill.",
    industryType: 'agro-based',
    explanation: "Cotton is a light, non-perishable raw material, so the industry can be located near major markets or ports for export, which are often in large cities with abundant labor.",
    mapImage: "/india.png",
    resources: [
      { type: 'raw_material', name: 'Cotton Fields (Gujarat)', x: 20, y: 50, weight: 4, icon: <IconTractor /> },
      { type: 'labor', name: 'Mumbai (Market & Port)', x: 28, y: 65, weight: 9, icon: <IconCity /> },
      { type: 'power', name: 'Power Plant', x: 25, y: 58, weight: 2, icon: <IconBolt /> },
    ]
  },
  {
    mission: "South India is a booming tech hub. Identify the prime location for a new IT Park.",
    industryType: 'knowledge-based',
    explanation: "IT Parks are 'footloose' industries. They depend on skilled labor, reliable infrastructure like power and internet, and good transportation (airports) for international clients, not raw materials.",
    mapImage: "/india.png",
    resources: [
      { type: 'labor', name: 'Skilled Workforce (Bengaluru)', x: 40, y: 78, weight: 10, icon: <IconLaptop /> },
      { type: 'labor', name: 'International Airport', x: 42, y: 77, weight: 5, icon: <IconPlane /> },
      { type: 'power', name: 'Reliable Power Grid', x: 38, y: 80, weight: 4, icon: <IconBolt /> },
      { type: 'market', name: 'Market & Connectivity', x: 40, y: 78, weight: 5, icon: <IconCity /> },
    ]
  },
  {
    mission: "A global car brand wants to set up a factory in the 'Detroit of Asia'. Where should it be?",
    industryType: 'market-oriented',
    explanation: "Automobile manufacturing requires a massive market, a port for exports, and a network of component suppliers. The final product is more costly to transport than the raw materials.",
    mapImage: "/india.png",
    resources: [
      { type: 'market', name: 'Major Market (Chennai)', x: 52, y: 80, weight: 9, icon: <IconCity /> },
      { type: 'raw_material', name: 'Chennai Port (Exports/Imports)', x: 54, y: 80, weight: 8, icon: <IconWater /> },
      { type: 'labor', name: 'Ancillary Industries', x: 50, y: 81, weight: 4, icon: <IconIndustry /> },
      { type: 'raw_material', name: 'Steel Supply', x: 68, y: 58, weight: 2, icon: <IconMountain /> },
    ]
  },
  {
    mission: "Demand for Indian seafood is high. Find the best place for a processing and export unit on the west coast.",
    industryType: 'agro-based',
    explanation: "Seafood is highly perishable. Processing units must be located extremely close to the source (fishing harbors) to maintain freshness. Access to an export port is also critical.",
    mapImage: "/india.png",
    resources: [
      { type: 'raw_material', name: 'Fishing Harbour (Kochi)', x: 38, y: 85, weight: 12, icon: <IconFish /> },
      { type: 'market', name: 'Kochi Port (Exports)', x: 39, y: 84, weight: 8, icon: <IconWater /> },
      { type: 'labor', name: 'Labor Force (Kochi)', x: 38.5, y: 85.5, weight: 3, icon: <IconCity /> },
    ]
  }
];

// --- Main Game Component ---
export default function IndustryArchitectGame() {

  const [levelIndex, setLevelIndex] = useState(0);
  const [placement, setPlacement] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [showTimeout, setShowTimeout] = useState(false);

  const level = levels[levelIndex];

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    if (timer <= 0) {
      setShowTimeout(true);
      setTimerActive(false);
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, timerActive]);

  // Reset placement and timer when level changes
  useEffect(() => {
    setPlacement(null);
    setTimer(60);
    setTimerActive(true);
    setShowTimeout(false);
  }, [levelIndex]);

  const suitability = useMemo(() => {
    if (!placement) return { score: 0, feedback: "Click on the map to place your industry." };
    let totalScore = 0;
    level.resources.forEach(resource => {
      const distance = Math.sqrt(Math.pow(placement.x - resource.x, 2) + Math.pow(placement.y - resource.y, 2));
      const score = Math.max(0, (100 - (distance * 2.5)) * resource.weight); // Increased distance penalty
      totalScore += score;
    });
    
    const maxPossibleScore = 100 * level.resources.reduce((sum, r) => sum + r.weight, 0);
    let finalScore = Math.max(0, Math.round((totalScore / maxPossibleScore) * 100));
    
    const timePenalty = Math.floor((60 - timer) / 5);
    finalScore = Math.max(0, finalScore - timePenalty);

    let feedbackText;
    if (finalScore > 90) {
      feedbackText = "Excellent placement! You've minimized costs and maximized efficiency.";
    } else if (finalScore > 70) {
      feedbackText = "Good placement, but there might be a slightly better spot.";
    } else {
      feedbackText = "This location has some drawbacks. Consider the key resources.";
    }
    
    return { score: finalScore, feedback: `Score: ${finalScore}%. ${feedbackText}` };
  }, [placement, level, timer]);

  useEffect(() => {
    setScore(suitability.score);
  }, [suitability]);

  const handleMapClick = (e) => {
    if (!timerActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlacement({ x, y });
  };

  const goToNextLevel = () => {
    if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else {
      // Could add a final screen here
      alert("Congratulations! You've completed all challenges.");
      setLevelIndex(0); // Restart
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-gray-800 text-white rounded-2xl shadow-2xl flex flex-col gap-4 relative font-sans">
      <div className="flex justify-between items-center w-full mb-2">
         <h2 className="text-3xl font-bold text-sky-400">Industry Architect: India</h2>
        <a href="#" className="text-3xl text-gray-400 hover:text-white transition-colors z-10"><IconHome /></a>
      </div>
      
      <div className="w-full flex items-center gap-4 mb-2">
        <div className="flex-1 h-3 bg-gray-600 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${timer > 10 ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`}
            style={{ width: `${(timer / 60) * 100}%` }}
          ></div>
        </div>
        <span className={`text-lg font-bold ${timer <= 10 ? 'text-red-400 animate-pulse' : 'text-green-200'}`}>{timer}s</span>
      </div>

      {showTimeout && (
        <div className="w-full text-center text-2xl text-red-500 font-bold mb-2 animate-bounce">Time's up!</div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 p-4 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold text-amber-300">Mission {levelIndex + 1} of {levels.length}</h3>
            <p className="text-gray-300 mt-2">{level.mission}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg flex-grow border border-slate-700">
            <h3 className="font-bold text-lg text-gray-200">Analysis</h3>
            <div className={`mt-2 p-3 rounded-md text-sm min-h-[6rem] ${score > 70 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-300'}`}>{suitability.feedback}</div>
            {placement && score > 90 && (
              <div className="mt-4 p-3 bg-slate-700 rounded-md animate-fade-in">
                <h4 className="font-bold text-yellow-300">Key Insight:</h4>
                <p className="text-sm text-gray-300">{level.explanation}</p>
                <button onClick={goToNextLevel} className="w-full mt-4 px-4 py-2 bg-green-600 rounded font-bold hover:bg-green-500 transition-colors">
                   {levelIndex < levels.length - 1 ? "Proceed to Next Challenge" : "Complete All Missions"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div 
          className="w-full md:w-2/3 h-[50vh] md:h-[600px] bg-gray-700 rounded-lg relative overflow-hidden cursor-crosshair border-2 border-slate-600"
          onClick={handleMapClick}
          style={{ backgroundImage: `url(${level.mapImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
        
          {level.resources.map(resource => (
            <div 
              key={resource.name}
              className="absolute text-3xl flex flex-col items-center group animate-pulse-slow"
              style={{ top: `${resource.y}%`, left: `${resource.x}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{resource.icon}</span>
              <span className="hidden group-hover:block absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded-md">{resource.name}</span>
            </div>
          ))}
          {placement && (
            <div 
              className="absolute text-5xl text-red-500 drop-shadow-lg animate-fade-in"
              style={{ top: `${placement.y}%`, left: `${placement.x}%`, transform: 'translate(-50%, -50%)' }}
            >
              <IconIndustry />
            </div>
          )}
        </div>
      </div>
       <style>{`
          @keyframes pulse-slow {
              50% {
                  transform: translate(-50%, -50%) scale(1.1);
                  opacity: 0.8;
              }
          }
          .animate-pulse-slow {
              animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes fade-in {
              from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          .animate-fade-in {
              animation: fade-in 0.5s ease-out forwards;
          }
      `}</style>
    </div>
  );
}

