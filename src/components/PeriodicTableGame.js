"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { elements } from '@/data/elements';
import Link from 'next/link';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// --- Helper Components ---
function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {};
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function Droppable({ id, x, y, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ gridColumn: x, gridRow: y }}>
      {children}
    </div>
  );
}

const legendItems = [
    { name: 'Alkali Metal', class: 'alkali-metal' },
    { name: 'Alkaline Earth Metal', class: 'alkaline-earth-metal' },
    { name: 'Lanthanide', class: 'lanthanide' },
    { name: 'Actinide', class: 'actinide' },
    { name: 'Transition Metal', class: 'transition-metal' },
    { name: 'Post-Transition Metal', class: 'post-transition-metal' },
    { name: 'Metalloid', class: 'metalloid' },
    { name: 'Nonmetal', class: 'diatomic-nonmetal' },
    { name: 'Noble Gas', class: 'noble-gas' },
    { name: 'Unknown', class: 'unknown' },
];

// --- Main Game Component ---
export default function PeriodicTableGame() {
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [placedElements, setPlacedElements] = useState({});
  const [elementsToPlace, setElementsToPlace] = useState([]);
  const [currentElement, setCurrentElement] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [funFact, setFunFact] = useState("");
  const timerRef = useRef();

  const setupGame = useCallback(() => {
    setScore(0);
    setMistakes(0);
    setPlacedElements({});
    setCombo(0);
    setMaxCombo(0);
    setFunFact("");
    setShowHint(false);
    setTimer(0);
    setTimerActive(true);
    const shuffledElements = shuffleArray([...elements]);
    setElementsToPlace(shuffledElements);
    setCurrentElement(shuffledElements[0]);
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  // Fun facts for a few elements (expand as needed)
  const elementFunFacts = {
    1: "Hydrogen is the most abundant element in the universe!",
    6: "Carbon is the basis for all known life on Earth.",
    8: "Oxygen makes up about 21% of Earth's atmosphere.",
    26: "Iron is the most used metal by mass.",
    79: "Gold is highly valued for jewelry and electronics.",
    118: "Oganesson is the heaviest element currently known.",
  };

  function playSound(type) {
    if (typeof window === 'undefined') return;
    try {
      const audio = new Audio(type === 'correct' ?
        'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7e.mp3' :
        'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7e.mp3');
      // Use different URLs for correct/incorrect if desired
      audio.volume = 0.2;
      audio.play();
    } catch {}
  }

  function handleDragEnd(event) {
    const { over, active } = event;
    setFunFact("");
    if (over && over.id === active.id) {
      setScore(s => s + 1);
      setCombo(c => {
        const newCombo = c + 1;
        setMaxCombo(m => Math.max(m, newCombo));
        return newCombo;
      });
      playSound('correct');
      const placed = elements.find(el => el.id === active.id);
      setPlacedElements(prev => ({ ...prev, [active.id]: placed }));
      const remaining = elementsToPlace.filter(el => el.id !== active.id);
      setElementsToPlace(remaining);
      setCurrentElement(remaining[0] || null);
      // Show fun fact if available
      if (elementFunFacts[placed.id]) {
        setFunFact(elementFunFacts[placed.id]);
      }
      if (remaining.length === 0) setTimerActive(false);
    } else {
      setMistakes(m => m + 1);
      setCombo(0);
      playSound('incorrect');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 820);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <div className="w-full max-w-fit flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Periodic Table Treasure Hunt</h2>
          <div className="flex gap-6 text-lg text-gray-700 items-center">
            <div className="font-semibold">Score: <span className="font-bold text-green-600">{score}</span></div>
            <div className="font-semibold">Mistakes: <span className="font-bold text-red-600">{mistakes}</span></div>
            <div className="font-semibold">Remaining: <span className="font-bold text-blue-600">{elementsToPlace.length}</span></div>
            <div className="font-semibold">Time: <span className="font-bold text-purple-600">{Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}</span></div>
            <div className="font-semibold">Combo: <span className="font-bold text-orange-500">{combo}</span></div>
            <div className="font-semibold">Max Combo: <span className="font-bold text-orange-700">{maxCombo}</span></div>
          </div>
        </div>

        {/* The Periodic Table Grid with Labels */}
        <div className="grid gap-1" style={{ gridTemplateColumns: '30px repeat(18, 60px)', gridTemplateRows: '30px repeat(10, 60px)' }}>
          {/* Group Labels (Columns) */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={`group-${i}`} className="font-bold text-xs text-center text-gray-500" style={{ gridColumn: i + 2, gridRow: 1 }}>{i + 1}</div>
          ))}
          {/* Period Labels (Rows) */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`period-${i}`} className="font-bold text-xs text-center text-gray-500 flex items-center justify-center" style={{ gridColumn: 1, gridRow: i + 2 }}>{i + 1}</div>
          ))}
          
          {elements.map(element => {
            const isPlaced = placedElements[element.id];
            return (
              <Droppable key={element.id} id={element.id} x={element.xpos + 1} y={element.ypos + 1}>
                <div className={`w-full h-full text-xs rounded border p-1 ${isPlaced ? element.category : 'border-gray-400 bg-gray-200'} flex flex-col justify-center`}>
                  {isPlaced ? (
                    <>
                      <div className="font-bold text-sm text-black">{element.symbol}</div>
                      <div className="text-black opacity-80 truncate text-xxs">{element.name}</div>
                    </>
                  ) : (
                    <div className="font-bold text-black text-center text-lg">{element.id}</div>
                  )}
                </div>
              </Droppable>
            );
          })}
        </div>
        
        {/* Category Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-4xl">
            {legendItems.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                    <div className={`${item.class} w-4 h-4 rounded border border-gray-400`}></div>
                    <span className="text-xs text-gray-600 font-semibold">{item.name}</span>
                </div>
            ))}
        </div>

        {/* The Drag Tray & Controls */}
        <div className={`mt-6 p-4 min-h-[160px] w-full max-w-lg bg-gray-200 rounded-lg shadow-inner flex flex-col items-center justify-center ${isShaking ? 'shake' : ''}`}>
          {currentElement ? (
            <>
              <h3 className="font-semibold text-center mb-4 text-black">Place this element:
                <button
                  className="ml-4 px-3 py-1 bg-yellow-300 text-yellow-900 rounded text-xs font-bold hover:bg-yellow-400"
                  onClick={() => setShowHint(h => !h)}
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              </h3>
              <Draggable id={currentElement.id}>
                <div className={`${currentElement.category} w-20 h-20 rounded-lg shadow-md flex flex-col items-center justify-center cursor-grab text-black`}>
                  <div className="font-bold text-2xl">{currentElement.symbol}</div>
                  <div className="text-sm font-semibold">{currentElement.name}</div>
                  {showHint && (
                    <div className="mt-2 text-xs text-blue-800 text-center">
                      Group: <b>{currentElement.xpos}</b> | Period: <b>{currentElement.ypos}</b> | Atomic #: <b>{currentElement.number}</b>
                    </div>
                  )}
                </div>
              </Draggable>
              {funFact && (
                <div className="mt-3 p-2 bg-green-100 text-green-900 rounded text-xs max-w-xs text-center border border-green-300">
                  <b>Fun Fact:</b> {funFact}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">🎉 You Won! 🎉</div>
              <p className="text-black mt-2">Final Score: {score} | Mistakes: {mistakes}</p>
              <p className="text-purple-700 mt-1">Time: {Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}</p>
              <p className="text-orange-700 mt-1">Max Combo: {maxCombo}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={setupGame} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
            Restart Game
          </button>
          <Link href="/" className="px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600">
            End Game (Go Home)
          </Link>
        </div>
      </div>
    </DndContext>
  );
}