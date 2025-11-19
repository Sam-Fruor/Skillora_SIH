"use client";

import { useState, useMemo } from 'react';
import { FaGlassWhiskey, FaChartLine, FaDollarSign } from "react-icons/fa";

// --- Main Game Component ---
export default function PerfectPourGame() {
  const [mode, setMode] = useState('design'); // design, forecast, profit

  // State for "Design the Glass"
  const [shape, setShape] = useState('cylinder');
  const [height, setHeight] = useState(10); // in cm
  const [radius1, setRadius1] = useState(3.5); // in cm
  const [radius2, setRadius2] = useState(3.5); // in cm (for frustum)

  // State for "Forecast Demand"
  const [saturdaySales, setSaturdaySales] = useState('');
  const [weeklyMilk, setWeeklyMilk] = useState('');
  const [forecastFeedback, setForecastFeedback] = useState('');

  // State for "Maximize Profit"
  const [optimalPrice, setOptimalPrice] = useState('');
  const [profitFeedback, setProfitFeedback] = useState('');

  const calculations = useMemo(() => {
    let volume = 0, surfaceArea = 0;
    const pi = Math.PI;

    if (shape === 'cylinder') {
      volume = pi * radius1 * radius1 * height;
      surfaceArea = (2 * pi * radius1 * height) + (pi * radius1 * radius1); // Lateral + one base
    } else if (shape === 'cone') {
      volume = (1/3) * pi * radius1 * radius1 * height;
      const slantHeight = Math.sqrt(radius1*radius1 + height*height);
      surfaceArea = pi * radius1 * slantHeight + pi * radius1 * radius1;
    } else if (shape === 'frustum') {
      volume = (1/3) * pi * height * (radius1*radius1 + radius2*radius2 + radius1*radius2);
      const slantHeight = Math.sqrt(Math.pow(radius1 - radius2, 2) + height*height);
      surfaceArea = pi * (radius1 + radius2) * slantHeight + pi * radius1 * radius1;
    }
    // 1 cm³ = 1 ml
    return { volume, surfaceArea };
  }, [shape, height, radius1, radius2]);

  const checkForecast = () => {
    const correctSaturday = 100 + (6 - 1) * 20; // a + (n-1)d
    const correctWeekly = (6/2) * (2*100 + (6-1)*20) * 0.3; // Sn = n/2(2a+(n-1)d), then convert glasses to Liters
    if (parseInt(saturdaySales) === correctSaturday && parseFloat(weeklyMilk).toFixed(1) == correctWeekly.toFixed(1)) {
        setForecastFeedback('Correct on both counts! Your planning is excellent.');
    } else {
        setForecastFeedback(`Not quite. The correct answer is ${correctSaturday} glasses on Saturday, and you'll need ${correctWeekly.toFixed(1)} Liters of milk for the week.`);
    }
  };

  const checkProfit = () => {
      // P(x) = -5x^2 + 100x - 250 -> a=-5, b=100
      const correctPrice = -100 / (2 * -5); // -b/2a
      if (parseInt(optimalPrice) === correctPrice) {
          setProfitFeedback('Correct! You found the price that brings in the maximum profit.');
      } else {
          setProfitFeedback(`Not quite. The price that maximizes profit is $${correctPrice}.`);
      }
  };


  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-gray-800 text-white rounded-2xl shadow-2xl">
      <div className="text-center mb-4 border-b border-gray-600 pb-4">
        <h2 className="text-3xl font-bold">The Perfect Pour: A Lassi Shop Simulation</h2>
        <div className="flex justify-center gap-4 mt-2">
            <button onClick={() => setMode('design')} className={`px-4 py-2 rounded flex items-center gap-2 ${mode === 'design' ? 'bg-blue-600' : 'bg-gray-600'}`}><FaGlassWhiskey /> Design</button>
            <button onClick={() => setMode('forecast')} className={`px-4 py-2 rounded flex items-center gap-2 ${mode === 'forecast' ? 'bg-blue-600' : 'bg-gray-600'}`}><FaChartLine /> Forecast</button>
            <button onClick={() => setMode('profit')} className={`px-4 py-2 rounded flex items-center gap-2 ${mode === 'profit' ? 'bg-blue-600' : 'bg-gray-600'}`}><FaDollarSign /> Profit</button>
        </div>
      </div>
      
      {/* Design Mode */}
      {mode === 'design' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-bold mb-2">Design a 300ml Glass</h3>
                <div className="space-y-4 bg-gray-700 p-4 rounded-lg">
                    <div>
                        <label>Shape: </label>
                        <select value={shape} onChange={e => setShape(e.target.value)} className="bg-gray-800 p-1 rounded">
                            <option value="cylinder">Cylinder</option>
                            <option value="cone">Cone</option>
                            <option value="frustum">Frustum (Tapered)</option>
                        </select>
                    </div>
                    <div>
                        <label>Height: {height.toFixed(1)} cm</label>
                        <input type="range" min="5" max="20" step="0.1" value={height} onChange={e => setHeight(parseFloat(e.target.value))} className="w-full" />
                    </div>
                    <div>
                        <label>Radius: {radius1.toFixed(1)} cm</label>
                        <input type="range" min="2" max="8" step="0.1" value={radius1} onChange={e => setRadius1(parseFloat(e.target.value))} className="w-full" />
                    </div>
                    {shape === 'frustum' && (
                        <div>
                            <label>Top Radius: {radius2.toFixed(1)} cm</label>
                            <input type="range" min="2" max="8" step="0.1" value={radius2} onChange={e => setRadius2(parseFloat(e.target.value))} className="w-full" />
                        </div>
                    )}
                </div>
                <div className={`mt-4 p-4 rounded-lg ${Math.abs(calculations.volume - 300) < 10 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <p className="font-bold text-lg">Volume: {calculations.volume.toFixed(0)} ml (Target: 300 ml)</p>
                    <p className="font-bold text-lg">Packaging Material (Surface Area): {calculations.surfaceArea.toFixed(0)} cm²</p>
                    <p className="text-sm mt-2">Goal: Get the volume as close to 300ml as possible with the MINIMUM surface area to save costs!</p>
                </div>
            </div>
            <div className="flex items-center justify-center h-80 bg-gray-900 rounded-lg">
                {/* Glass Shape Visualization with dynamic sizing */}
                {(() => {
                  // Hypothetical scaling: height 5-20cm maps to 80-300px, radius 2-8cm maps to 40-160px width
                  const minH = 80, maxH = 300, minR = 40, maxR = 160;
                  const scaleHeight = minH + ((height - 5) / (20 - 5)) * (maxH - minH);
                  // For frustum, use average of radius1 and radius2 for width
                  let scaleWidth;
                  if (shape === 'frustum') {
                    const avgR = (radius1 + radius2) / 2;
                    scaleWidth = minR + ((avgR - 2) / (8 - 2)) * (maxR - minR);
                  } else {
                    scaleWidth = minR + ((radius1 - 2) / (8 - 2)) * (maxR - minR);
                  }
                  if (shape === 'cylinder') {
                    return <img src="/cylinder.png" alt="Cylinder Glass" style={{height: scaleHeight, width: scaleWidth, objectFit: 'contain'}} />;
                  }
                  if (shape === 'cone') {
                    return <img src="/cone.png" alt="Cone Glass" style={{height: scaleHeight, width: scaleWidth, objectFit: 'contain'}} />;
                  }
                  if (shape === 'frustum') {
                    return <img src="/frustum.png" alt="Frustum Glass" style={{height: scaleHeight, width: scaleWidth, objectFit: 'contain'}} />;
                  }
                  return null;
                })()}
            </div>
        </div>
      )}

      {/* Forecast Mode */}
      {mode === 'forecast' && (
        <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Forecast Demand</h3>
            <p className="mb-4">On Monday, you sold 100 glasses. Sales are increasing by a steady 20 glasses each day (an Arithmetic Progression). Your shop is open Monday to Saturday.</p>
            <div className="space-y-4">
                <div>
                    <label>How many glasses will you sell on Saturday (the 6th day)?</label>
                    <input type="number" value={saturdaySales} onChange={e => setSaturdaySales(e.target.value)} className="w-full p-2 bg-gray-800 rounded mt-1" />
                </div>
                <div>
                    <label>How many Liters of milk will you need for the whole week (Mon-Sat)? (1 glass = 300ml)</label>
                    <input type="number" value={weeklyMilk} onChange={e => setWeeklyMilk(e.target.value)} className="w-full p-2 bg-gray-800 rounded mt-1" />
                </div>
                <button onClick={checkForecast} className="px-4 py-2 bg-green-600 rounded">Check Answer</button>
                {forecastFeedback && <p className="mt-4 p-2 bg-gray-800 rounded">{forecastFeedback}</p>}
            </div>
        </div>
      )}

      {/* Profit Mode */}
      {mode === 'profit' && (
        <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Maximize Profit</h3>
            <p className="mb-4">The daily profit P from your shop is modeled by the equation <span className="font-mono text-yellow-300">P(x) = -5x² + 100x - 250</span>, where 'x' is the price of a single glass of lassi.</p>
            <div>
                <label>What price 'x' should you set to get the maximum possible profit?</label>
                <input type="number" value={optimalPrice} onChange={e => setOptimalPrice(e.target.value)} className="w-full p-2 bg-gray-800 rounded mt-1" />
            </div>
            <button onClick={checkProfit} className="mt-4 px-4 py-2 bg-green-600 rounded">Check Answer</button>
            {profitFeedback && <p className="mt-4 p-2 bg-gray-800 rounded">{profitFeedback}</p>}
        </div>
      )}
    </div>
  );
}