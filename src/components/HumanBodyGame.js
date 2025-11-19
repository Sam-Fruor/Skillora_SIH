"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaFileMedicalAlt, FaStethoscope, FaMicroscope, FaSyringe } from "react-icons/fa";

/* --- Case Files --- */
const caseFiles = [
  {
    id: 1,
    symptom: "Patient reports sharp pain in the upper right abdomen and fatigue.",
    correctOrgan: "liver",
    diagnosis: "Hepatitis (Inflammation of the liver)",
    cure: "Prescribed antiviral medication and rest.",
    analysisImage: "/liver.png",
  },
  {
    id: 2,
    symptom: "Patient has difficulty breathing, a persistent cough, and chest pain.",
    correctOrgan: "lungs",
    diagnosis: "Pneumonia (Infection in the lungs)",
    cure: "A course of antibiotics and respiratory therapy.",
    analysisImage: "/lungs.png",
  },
  {
    id: 3,
    symptom: "Patient feels a fluttering in the chest and reports dizzy spells.",
    correctOrgan: "heart",
    diagnosis: "Arrhythmia (Irregular heartbeat)",
    cure: "Medication to control heart rate and lifestyle adjustments.",
    analysisImage: "/hear.png",
  },
];

/* --- Organs Map --- */
const organData = [
  { id: "brain", name: "Brain", position: { top: "0%", left: "47.5%" } },
  { id: "lungs", name: "Lungs", position: { top: "38%", left: "38%" } },
  { id: "heart", name: "Heart", position: { top: "34%", left: "44%" } },
  { id: "liver", name: "Liver", position: { top: "46%", left: "42%" } },
  { id: "stomach", name: "Stomach", position: { top: "48%", left: "53%" } },
];

/* --- Sound Hook --- */
const useSound = () =>
  useCallback((src, volume = 0.4) => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  }, []);

export default function HumanBodyGame() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [gameState, setGameState] = useState("caseFile"); // caseFile, inspection, diagnosis
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const currentCase = caseFiles[caseIndex];
  const playSound = useSound();

  // Timer effect when inspection active
  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Clear selections on entering inspection state
  useEffect(() => {
    if (gameState === "inspection") {
      setSelectedOrgan(null);
      setFeedback("");
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [gameState]);

  const handleOrganClick = (organ) => {
    setSelectedOrgan(organ);
    setFeedback(`Selected: ${organ.name}. Now choose an analysis tool.`);
    playSound("https://cdn.pixabay.com/audio/2022/03/15/audio_731c517f73.mp3");
  };

  const handleAnalysis = (tool) => {
    if (!selectedOrgan) {
      setFeedback("⚠️ Please select an organ first.");
      playSound("https://cdn.pixabay.com/audio/2021/08/04/audio_bb636838d7.mp3");
      return;
    }
    playSound("https://cdn.pixabay.com/audio/2022/04/18/audio_34b322c36a.mp3");

    if (selectedOrgan.id === currentCase.correctOrgan) {
      setFeedback(`✅ The scan of the ${selectedOrgan.name} reveals the problem!`);
      // Bonus scoring could be based on timer
      setScore((prev) => prev + 100 + Math.max(0, 30 - timer));
      setIsTimerActive(false);
      setTimeout(() => setGameState("diagnosis"), 900);
    } else {
      setFeedback(`❌ ${tool} on the ${selectedOrgan.name} shows normal results.`);
      setScore((prev) => Math.max(0, prev - 10)); // Penalty
    }
  };

  const goToNextCase = () => {
    setCaseIndex((prev) => (prev + 1) % caseFiles.length);
    setGameState("caseFile");
    setSelectedOrgan(null);
    setFeedback("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 text-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 font-sans relative">
      {/* Home Icon Button */}
      <Link href="/" className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-blue-600 transition-colors" title="Home">
        <FaHome />
      </Link>
      {/* Left Panel: Body Diagram */}
      <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center relative">
        {gameState !== "diagnosis" ? (
          <>
            <img
              src="/fullBody.png"
              alt="Human Body Diagram"
              className="w-full max-w-md"
            />
            {gameState === "inspection" &&
              organData.map((organ) => (
                <button
                  key={organ.id}
                  onClick={() => handleOrganClick(organ)}
                  title={organ.name}
                  aria-label={`Select ${organ.name}`}
                  className={`absolute w-7 h-7 rounded-full border-2 transition-transform duration-150 focus:outline-none focus:ring-4 ${
                    selectedOrgan?.id === organ.id
                      ? "bg-green-500 scale-125 shadow-lg border-green-400"
                      : "bg-red-500/70 hover:bg-red-500"
                  }`}
                  style={{
                    top: organ.position.top,
                    left: organ.position.left,
                    transform: "translate(0%, 250%)",
                    
                  }}
                />
              ))}
          </>
        ) : (
          <div className="text-center text-white">
            <h4 className="font-bold mb-4 text-xl">Analysis Result</h4>
            <img
              src={currentCase.analysisImage}
              alt="Analysis Scan"
              className="w-full rounded-lg border-4 border-green-500 shadow-lg shadow-green-400/60"
            />
          </div>
        )}
      </div>

      {/* Right Panel: Info & Controls */}
  <div className="md:w-1/2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
          {gameState === "caseFile" && (
            <>
              <h3 className="text-3xl text-amber-600 font-bold flex items-center gap-3 mb-4">
                <FaFileMedicalAlt /> Case File #{currentCase.id}
              </h3>
              <p className="bg-yellow-100 p-4 rounded mb-6 text-lg">{currentCase.symptom}</p>
              <button
                onClick={() => setGameState("inspection")}
                className="w-full py-3 text-white bg-blue-600 rounded hover:bg-blue-700 shadow-lg focus:outline-none focus:ring-4 transition"
                autoFocus
              >
                Begin Inspection
              </button>
            </>
          )}
          {gameState === "inspection" && (
            <>
              <h3 className="text-3xl font-bold mb-3 text-cyan-600">Visual Inspection</h3>
              <p className="text-gray-600 mb-4">Click a red hotspot to select an organ, then use an analysis tool below.</p>
              <div className="min-h-[60px] p-4 rounded border border-gray-300 text-center font-semibold text-lg text-gray-700">
                {feedback || "Awaiting organ selection..."}
              </div>
            </>
          )}
          {gameState === "diagnosis" && (
            <>
              <h3 className="text-3xl font-bold mb-3 text-green-700">Diagnosis Complete!</h3>
              <p className="text-lg mb-4">{feedback}</p>
              <div className="bg-green-100 p-4 rounded border border-green-300 text-green-800">
                <p>
                  <strong>Diagnosis:</strong> {currentCase.diagnosis}
                </p>
                <p className="mt-2">
                  <strong>Cure:</strong> {currentCase.cure}
                </p>
              </div>
              <button
                onClick={goToNextCase}
                className="w-full py-3 mt-6 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-lg transition"
              >
                {caseIndex < caseFiles.length - 1 ? "Next Case" : "Restart"}
              </button>
            </>
          )}
        </div>

        {/* Tools Panel */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2 text-center">
            Analysis Tools
          </h3>
          <div className="flex justify-around gap-6">
            {[{ tool: "Stethoscope", Icon: FaStethoscope }, { tool: "Microscope", Icon: FaMicroscope }, { tool: "Syringe", Icon: FaSyringe }].map(({ tool, Icon }) => (
              <button
                key={tool}
                onClick={() => handleAnalysis(tool)}
                disabled={gameState !== "inspection"}
                title={tool}
                className="flex flex-col items-center gap-1 text-gray-500 disabled:opacity-40 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition"
              >
                <Icon className="text-4xl" />
                <span className="text-xs">{tool === "Stethoscope" ? "Listen" : tool === "Microscope" ? "Scan" : "Biopsy"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Score, Timer & Reset */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-gray-700 font-semibold">
            <div>Score: <span className="text-green-600">{score}</span></div>
            <div>Time: <span className="text-cyan-600">{timer}s</span></div>
          </div>
          <button
            onClick={() => {
              setCaseIndex(0);
              setGameState("caseFile");
              setSelectedOrgan(null);
              setFeedback("");
              setScore(0);
              setTimer(0);
              setIsTimerActive(false);
            }}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold shadow transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
