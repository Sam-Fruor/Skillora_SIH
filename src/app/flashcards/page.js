
"use client";

"use client";
import { useState } from "react";

const defaultSubjects = [
  {
    id: "chemistry",
    name: "Chemistry",
    cards: [
      { q: "What is the chemical symbol for water?", a: "H₂O" },
      { q: "What is the atomic number of Carbon?", a: "6" },
      { q: "What is NaCl commonly known as?", a: "Salt" },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    cards: [
      { q: "What is the unit of force?", a: "Newton (N)" },
      { q: "What is the speed of light?", a: "299,792,458 m/s" },
      { q: "Who formulated the laws of motion?", a: "Isaac Newton" },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    cards: [
      { q: "What is the powerhouse of the cell?", a: "Mitochondria" },
      { q: "What pigment makes plants green?", a: "Chlorophyll" },
      { q: "What is the basic unit of life?", a: "Cell" },
    ],
  },
  {
    id: "optics",
    name: "Optics",
    cards: [
      { q: "What is the speed of light in vacuum?", a: "299,792,458 m/s" },
      { q: "What is the law of reflection?", a: "Angle of incidence = Angle of reflection" },
      { q: "What is the lens formula?", a: "1/f = 1/v - 1/u" },
      { q: "What is the SI unit of focal length?", a: "Meter (m)" },
      { q: "What is total internal reflection?", a: "When light is completely reflected inside a medium." },
    ],
  },
];


export default function FlashcardsPage() {
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [selected, setSelected] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const handleSubject = (id) => {
    setSelected(subjects.find((s) => s.id === id));
    setIndex(0);
    setShowAnswer(false);
  };

  const nextCard = () => {
    setShowAnswer(false);
    setIndex((i) => (i + 1) % selected.cards.length);
  };
  const prevCard = () => {
    setShowAnswer(false);
    setIndex((i) => (i - 1 + selected.cards.length) % selected.cards.length);
  };

  // Add new subject
  const addSubject = () => {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, { id: newSubject.toLowerCase().replace(/\s+/g, '-'), name: newSubject, cards: [] }]);
    setNewSubject("");
  };

  // Add new card to selected subject
  const addCard = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setSubjects(subjects.map(s =>
      s.id === selected.id
        ? { ...s, cards: [...s.cards, { q: newQ, a: newA }] }
        : s
    ));
    setNewQ("");
    setNewA("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <h1 className="text-4xl font-extrabold text-green-800 mb-8 drop-shadow-lg">Flashcards</h1>
      {!selected ? (
        <>
        <div className="mb-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 text-blue-800">Add a New Subject</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              placeholder="Subject name (e.g. Math, History)"
              className="p-2 rounded border border-green-300 flex-1"
            />
            <button onClick={addSubject} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubject(subject.id)}
              className="rounded-2xl shadow-xl bg-white hover:bg-green-100 transition-all duration-300 p-8 flex flex-col items-center border-4 border-green-300 hover:scale-105 cursor-pointer"
              style={{ minHeight: 180 }}
            >
              <span className="text-3xl font-bold text-green-700 mb-2">{subject.name}</span>
              <span className="text-lg text-gray-500">{subject.cards.length} Flashcards</span>
            </button>
          ))}
        </div>
        </>
      ) : (
        <div className="flex flex-col items-center w-full max-w-lg">
          <button
            onClick={() => setSelected(null)}
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition self-start"
          >
            ← Choose Another Subject
          </button>
          <div className="relative w-full flex flex-col items-center">
            <div
              className="w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center min-h-[220px] border-4 border-blue-200 transition-all duration-500 cursor-pointer hover:scale-105 relative"
              onClick={() => setShowAnswer((v) => !v)}
              style={{ perspective: 1000 }}
            >
              <div
                className="relative w-full h-full"
                style={{ width: '100%', height: '100%', minHeight: 120 }}
              >
                <div
                  className={`absolute w-full h-full flex flex-col items-center justify-center transition-transform duration-500 ${showAnswer ? '[transform:rotateY(180deg)]' : ''}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front (Question) */}
                  <div
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      color: '#1a202c',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      padding: '0 1rem',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {selected.cards[index].q}
                  </div>
                  {/* Back (Answer) */}
                  <div
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      color: '#2563eb',
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '0 1rem',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {selected.cards[index].a}
                  </div>
                </div>
              </div>
            </div>
            <span className="mt-4 text-sm text-gray-500">Click card to {showAnswer ? 'hide' : 'show'} answer</span>
            <div className="flex gap-6 mt-8">
              <button onClick={prevCard} className="px-6 py-2 bg-blue-200 rounded-full text-blue-800 font-bold hover:bg-blue-300 transition">Previous</button>
              <button onClick={nextCard} className="px-6 py-2 bg-blue-200 rounded-full text-blue-800 font-bold hover:bg-blue-300 transition">Next</button>
            </div>
            {/* Add new card */}
            <div className="mt-10 w-full">
              <h3 className="text-lg font-bold mb-2 text-green-800">Add a New Flashcard</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newQ}
                  onChange={e => setNewQ(e.target.value)}
                  placeholder="Question"
                  className="p-2 rounded border border-blue-300"
                />
                <input
                  type="text"
                  value={newA}
                  onChange={e => setNewA(e.target.value)}
                  placeholder="Answer"
                  className="p-2 rounded border border-blue-300"
                />
                <button onClick={addCard} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2">Add Card</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
