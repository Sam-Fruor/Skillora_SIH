
"use client";
import { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';

function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{title}</h2>
      <p className="text-md md:text-lg text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}


export default function HomePage() {
  // Array of game data - UPDATED AS PER YOUR REQUEST
  const gamesList = [
    //{ id: 1, title: "Periodic Table Treasure Hunt", description: "An alchemy-themed chemistry puzzle.", imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Chemistry" },
    // { id: 2, title: "Motor Works", description: "Build a DC motor and see physics in action.", imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Physics" },
    // { id: 3, title: "Human Body Explorer", description: "Solve medical mysteries in this biology game.", imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Biology" },
    // { id: 4, title: "The Perfect Pour", description: "A business sim about math and lassi.", imageUrl: "https://placehold.co/600x400/f39c12/ffffff?text=Maths" },
    // { id: 5, title: "Industry Architect", description: "A geography puzzle of resource management.", imageUrl: "https://placehold.co/600x400/7f8c8d/ffffff?text=Social+Science" },
    // { id: 6, title: "Melody Sculptor", description: "A 3D sandbox for building musical sculptures.", imageUrl: "https://placehold.co/600x400/a855f7/ffffff?text=Creative" },
    
    { id: 1, title: "Periodic Table Treasure Hunt", description: "An alchemy-themed chemistry puzzle.", imageUrl: "Chem.jpeg" },
    { id: 5, title: "Industry Architect", description: "A geography puzzle of resource management.", imageUrl: "Social.jpeg" },
    { id: 6, title: "Melody Sculptor", description: "A 3D sandbox for building musical sculptures.", imageUrl: "Melody.jpeg" },
    { id: 3, title: "Human Body Explorer", description: "Solve medical mysteries in this biology game.", imageUrl: "Bio.jpeg" },
    { id: 7, title: "Celestial Architect", description: "Design Miniature Solar System", imageUrl: "Solar.jpeg" },
    { id: 4, title: "The Perfect Pour", description: "A business sim about math and lassi.", imageUrl: "Math.jpeg" },
    { id: 2, title: "Motor Works", description: "Build a DC motor and see physics in action.", imageUrl: "Phy.jpg" },
  ];

  // Scroll state for hero transitions
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.3);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section - Fullscreen with animated background */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen w-full overflow-hidden bg-green-100">
        {/* Logo removed as requested */}
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#DDF4E7] rounded-full opacity-80 animate-blob1" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-[#67C090] rounded-full opacity-70 animate-blob2" />
          <div className="absolute top-[30%] right-[-15%] w-[40vw] h-[40vw] bg-[#26667F] rounded-full opacity-60 animate-blob3" />
          <div className="absolute bottom-[-10%] left-[10%] w-[30vw] h-[30vw] bg-[#124170] rounded-full opacity-50 animate-blob4" />
        </div>
        {/* Animated atom orbit element circling the text, with z-index swap for under/over effect */}
        <div className="pointer-events-none">
          <div className="animate-atom-orbit atom-orbit-top absolute z-20">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="#67C090" opacity="0.7" />
              <rect x="35" y="35" width="50" height="50" rx="15" fill="#26667F" opacity="0.7" />
              {/* <circle cx="80" cy="40" r="15" fill="#DDF4E7" opacity="0.8" /> */}
              {/* <circle cx="45" cy="80" r="10" fill="#124170" opacity="0.8" /> */}
            </svg>
          </div>
          <div className="animate-atom-orbit atom-orbit-bottom absolute z-0">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="#67C090" opacity="0.7" />
              <rect x="35" y="35" width="50" height="50" rx="15" fill="#26667F" opacity="0.7" />
              {/* <circle cx="80" cy="40" r="15" fill="#DDF4E7" opacity="0.8" /> */}
              {/* <circle cx="45" cy="80" r="10" fill="#124170" opacity="0.8" /> */}
            </svg>
          </div>
        </div>
        <h1 className={`text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-lg transition-all duration-500 ${scrolled ? 'opacity-0 translate-y-[-40px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          Where Learning Becomes an Adventure.
        </h1>
        <img
          src="/brain%20sides-bro.png"
          alt="Brain Side"
          className={`w-64 md:w-96 mt-8 mb-2 transition-all duration-500 ${scrolled ? 'translate-y-[-120px] scale-75' : ''}`}
          style={{ objectFit: 'contain' }}
        />
        <p className={`mt-4 text-lg md:text-xl text-green-600 max-w-2xl drop-shadow transition-all duration-500 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          Welcome to Skillora! The fun way to learn about sustainability and make a difference.
        </p>
      </section>

      {/* Game Showcase Section (now includes Flashcards CTA and Contact Us) */}
      <section id="games" className="py-16 px-4">
        <SectionHeader 
          title="Enter the Game Zone" 
          subtitle="Choose an adventure and test your knowledge" 
        />
        <div className="flex items-center gap-8 mt-8 overflow-x-auto pb-4 px-8">
          {gamesList.map(game => (
            <GameCard 
              key={game.id}
              id={game.id} 
              title={game.title} 
              description={game.description}
              imageUrl={game.imageUrl} 
            />
          ))}
        </div>

        {/* Flashcards Call-to-Action Section */}
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Want to review with Flashcards?</h2>
          <a href="/flashcards" className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300">
            Go to Flashcards
          </a>
        </div>

        {/* Contact Us Section removed */}
      </section>

      {/* Team Play Section - commented out */}
      {/** <TeamPlaySection /> **/}
    </main>
  );
}
