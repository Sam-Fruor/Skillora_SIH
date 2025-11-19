"use client";
"use client";

import { useState, useRef, useEffect } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

// --- Corrected Image URLs (place images inside /public) ---
const partImages = {
  magnets: "/magn.png",
  armature: "/armature.png",
  commutator: "/commutator.png",
  brushes: "/brushes.png",
};

// --- Draggable Part Component ---
function DraggablePart({ id, isPlaced }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: isPlaced,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isPlaced ? 0.3 : 1,
    cursor: isPlaced ? "default" : "grab",
    transition: "opacity 0.3s ease",
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? 'relative' : undefined,
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      src={partImages[id]}
      alt={id}
      className="w-32 h-auto object-contain drop-shadow-lg"
      draggable={false}
    />
  );
}

// --- Droppable Slot Component ---
function DroppableSlot({ id, children, isFilled, position }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute border-2 border-dashed rounded-lg transition-colors flex items-center justify-center p-2 text-center text-gray-400 ${
        isFilled ? "border-green-500 bg-green-500/10" : "border-gray-500"
      }`}
      style={position}
    >
      {isFilled ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partImages[id.replace("-slot", "")]}
          alt={id}
          className="w-full h-full object-contain opacity-70"
        />
      ) : (
        children
      )}
    </div>
  );
}

// --- Main Game Component ---
export default function MotorWorksGame() {
  const [activeId, setActiveId] = useState(null);
  const [mode, setMode] = useState("build");
  const [placedParts, setPlacedParts] = useState({});
  const [batteryReversed, setBatteryReversed] = useState(false);
  const [magnetsFlipped, setMagnetsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [lastFact, setLastFact] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState("");
  const timerRef = useRef();

  const allPartsPlaced = Object.keys(placedParts).length === 4;

  // Fun facts
  const partFacts = {
    magnets: "Magnets create the magnetic field that makes the motor spin!",
    armature: "The armature is a coil of wire that rotates inside the field.",
    commutator: "The commutator switches current direction, keeping it spinning.",
    brushes: "Brushes deliver electricity to the spinning armature.",
  };

  // Quiz Questions
  const quizQuestions = [
    {
      q: "What is the main function of the commutator?",
      options: [
        "Create a magnetic field",
        "Switch current direction",
        "Hold the armature in place",
        "Deliver power to the brushes",
      ],
      answer: 1,
    },
    {
      q: "What happens if you reverse the battery?",
      options: [
        "The motor spins faster",
        "The motor stops",
        "The motor spins in the opposite direction",
        "Nothing changes",
      ],
      answer: 2,
    },
    {
      q: "Which part delivers electricity to the armature?",
      options: ["Magnets", "Brushes", "Commutator", "Armature"],
      answer: 1,
    },
  ];

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  // Play sounds
  function playSound(type) {
    if (typeof window === "undefined") return;
    try {
      const audio = new Audio(
        type === "correct"
          ? "https://cdn.pixabay.com/audio/2022/03/15/audio_9c1c8e3.mp3"
          : "https://cdn.pixabay.com/audio/2022/03/15/audio_3f8c0b4.mp3"
      );
      audio.volume = 0.3;
      audio.play();
    } catch {}
  }

  // Handle Drag End
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = ({ over, active }) => {
    setLastFact("");
    if (over && over.id === `${active.id}-slot` && !placedParts[active.id]) {
      setPlacedParts((prev) => ({ ...prev, [active.id]: true }));
      setScore((s) => s + 100);
      setCombo((c) => {
        const newCombo = c + 1;
        setMaxCombo((m) => Math.max(m, newCombo));
        return newCombo;
      });
      setLastFact(partFacts[active.id]);
      playSound("correct");
    } else {
      setCombo(0);
      playSound("incorrect");
    }
    setActiveId(null);
  };

  // Reset Game
  const resetGame = () => {
    setMode("build");
    setPlacedParts({});
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimer(0);
    setTimerActive(true);
    setLastFact("");
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFeedback("");
    setBatteryReversed(false);
    setMagnetsFlipped(false);
  };

  const motorSpinDirection =
    (batteryReversed ? -1 : 1) * (magnetsFlipped ? -1 : 1);

  // Quiz Answer Handler
  function handleQuizAnswer(idx) {
    if (quizQuestions[quizIndex].answer === idx) {
      setQuizScore((s) => s + 1);
      setQuizFeedback("✅ Correct!");
      playSound("correct");
    } else {
      setQuizFeedback("❌ Incorrect.");
      playSound("incorrect");
    }
    setTimeout(() => {
      setQuizFeedback("");
      setQuizIndex((i) => i + 1);
    }, 1000);
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-800 text-white rounded-2xl shadow-2xl relative">
      <Link
        href="/"
        className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white transition-colors"
      >
        <FaHome />
      </Link>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold">⚡ Motor Works</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-2 text-lg">
          <span>
            Score: <span className="text-green-400 font-bold">{score}</span>
          </span>
          <span>
            Combo: <span className="text-orange-400 font-bold">{combo}</span>
          </span>
          <span>
            Max Combo: <span className="text-orange-600 font-bold">{maxCombo}</span>
          </span>
          <span>
            Time:{" "}
            <span className="text-purple-400 font-bold">
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </span>
          </span>
        </div>

        {/* Mode Buttons */}
        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <button
            onClick={resetGame}
            className={`px-4 py-2 rounded transition ${
              mode === "build" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            1. Build Mode
          </button>
          <button
            onClick={() => {
              setMode("test");
              setTimerActive(false);
            }}
            disabled={!allPartsPlaced}
            className={`px-4 py-2 rounded transition ${
              mode === "test" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            } disabled:bg-gray-700 disabled:cursor-not-allowed`}
          >
            2. Test Mode
          </button>
          <button
            onClick={() => setMode("challenge1")}
            disabled={!allPartsPlaced}
            className={`px-4 py-2 rounded transition ${
              mode === "challenge1"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            } disabled:bg-gray-700 disabled:cursor-not-allowed`}
          >
            Challenge: Reverse It!
          </button>
          <button
            onClick={() => setMode("quiz")}
            disabled={!allPartsPlaced}
            className={`px-4 py-2 rounded transition ${
              mode === "quiz" ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            } disabled:bg-gray-700 disabled:cursor-not-allowed`}
          >
            Quiz Mode
          </button>
        </div>
      </div>

      {/* Game Context */}
  <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Parts Bin */}
          <div className="col-span-1 bg-gray-900 p-4 rounded-lg flex flex-col items-center gap-6">
            <h3 className="font-bold text-xl border-b border-gray-600 pb-2 w-full text-center">
              Component Parts
            </h3>
            <DraggablePart id="magnets" isPlaced={placedParts.magnets} />
            <DraggablePart id="armature" isPlaced={placedParts.armature} />
            <DraggablePart id="commutator" isPlaced={placedParts.commutator} />
            <DraggablePart id="brushes" isPlaced={placedParts.brushes} />
            <DragOverlay adjustScale={false} style={{ transformOrigin: 'center top' }}>
              {activeId ? (
                <img
                  src={partImages[activeId]}
                  alt={activeId}
                  className="w-32 h-auto object-contain drop-shadow-lg"
                  style={{ pointerEvents: 'none' }}
                />
              ) : null}
            </DragOverlay>
            {lastFact && (
              <div className="mt-4 p-2 bg-green-100 text-green-900 rounded text-xs max-w-xs text-center border border-green-300">
                <b>Fun Fact:</b> {lastFact}
              </div>
            )}
          </div>

          {/* Assembly Area */}
          <div className="col-span-1 md:col-span-2 bg-gray-700 h-[450px] rounded-lg relative overflow-hidden p-4">
            {mode === "build" && (
              <>
                <h3 className="text-center text-gray-400 font-semibold p-6">
                  Drag Parts to their Slots
                </h3>
                <DroppableSlot
                  id="magnets-slot"
                  isFilled={placedParts.magnets}
                  position={{
                   top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "calc(50% - 40px)",
                    height: "calc(70% - 40px)",
                  }}
                >
                  Magnets
                </DroppableSlot>
                <DroppableSlot
                  id="armature-slot"
                  isFilled={placedParts.armature}
                  position={{
                    top: "55%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 200,
                    height: 200,
                  }}
                >
                  Armature
                </DroppableSlot>
                <DroppableSlot
                  id="commutator-slot"
                  isFilled={placedParts.commutator}
                  position={{
                    top: "70%",
                    right: "42.5%",
                    transform: "translateY(-50%)",
                    width: 100,
                    height: 100,
                  }}
                >
                  Commutator
                </DroppableSlot>
                <DroppableSlot
                  id="brushes-slot"
                  isFilled={placedParts.brushes}
                  position={{
                    top: "50%",
                    right: "30%",
                    transform: "translateY(-50%)",
                    width: 80,
                    height: 80,
                  }}
                >
                  Brushes
                </DroppableSlot>
              </>
            )}

            {/* Test / Challenge / Quiz Rendering */}
            {mode !== "build" && allPartsPlaced && mode !== "quiz" && (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="relative w-80 h-80"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(60deg)",
                  }}
                >
                  {/* Magnets */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partImages.magnets}
                      alt="Magnets"
                      className={`absolute w-full h-full object-contain transition-transform duration-500 ${
                        magnetsFlipped ? "scale-x-[-1]" : ""
                      }`}
                    />
                  </div>
                  {/* Spinning Armature + Commutator */}
                  <div
                    className="absolute inset-0"
                    style={{
                      animation: `spin ${2 / Math.abs(motorSpinDirection)}s linear infinite`,
                      animationDirection:
                        motorSpinDirection > 0 ? "normal" : "reverse",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partImages.armature}
                      alt="Armature"
                      className="absolute w-full h-full object-contain"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partImages.commutator}
                      alt="Commutator"
                      className="absolute w-full h-full object-contain scale-50"
                      style={{ transform: "translateX(65px)" }}
                    />
                  </div>
                  {/* Brushes */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partImages.brushes}
                      alt="Brushes"
                      className="absolute w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === "challenge1" && allPartsPlaced && (
              <div className="absolute bottom-2 left-2 flex gap-4">
                <button
                  onClick={() => setBatteryReversed((r) => !r)}
                  className={`p-2 rounded ${
                    batteryReversed ? "bg-yellow-500" : "bg-gray-600"
                  }`}
                >
                  Reverse Battery
                </button>
                <button
                  onClick={() => setMagnetsFlipped((f) => !f)}
                  className={`p-2 rounded ${
                    magnetsFlipped ? "bg-yellow-500" : "bg-gray-600"
                  }`}
                >
                  Flip Magnets
                </button>
              </div>
            )}

            {mode === "quiz" && allPartsPlaced && (
              <div className="flex flex-col items-center justify-center h-full">
                {quizIndex < quizQuestions.length ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">Quiz Time!</h3>
                    <div className="bg-gray-900 p-4 rounded-lg shadow-lg max-w-md w-full">
                      <div className="text-lg font-semibold mb-2">
                        {quizQuestions[quizIndex].q}
                      </div>
                      <div className="flex flex-col gap-2">
                        {quizQuestions[quizIndex].options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 text-left text-white transition"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {quizFeedback && (
                        <div className="mt-2 text-center font-bold text-green-400">
                          {quizFeedback}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      Quiz Complete!
                    </div>
                    <div className="text-lg">
                      Your Quiz Score:{" "}
                      <span className="font-bold">
                        {quizScore} / {quizQuestions.length}
                      </span>
                    </div>
                    <button
                      onClick={resetGame}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DndContext>

      {/* Spin Animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}
