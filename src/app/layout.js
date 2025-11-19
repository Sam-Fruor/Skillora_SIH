
"use client";
// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

function Navbar() {
  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const curr = window.scrollY;
          if (curr > lastScroll.current && curr > 60) {
            setShow(false); // scroll down, hide
          } else {
            setShow(true); // scroll up, show
          }
          lastScroll.current = curr;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Streak and Points State ---
  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);
  // Points per subject (placeholder, to be updated by subject pages)
  const [points, setPoints] = useState({});

  // On mount, load streak and points from localStorage
  useEffect(() => {
    const streakVal = parseInt(localStorage.getItem('skillora_streak') || '0', 10);
    const lastDate = localStorage.getItem('skillora_last_study');
    const pointsVal = JSON.parse(localStorage.getItem('skillora_points') || '{}');
    setStreak(streakVal);
    setLastStudyDate(lastDate);
    setPoints(pointsVal);
  }, []);

  // Listen for streak/points updates from other tabs/pages
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'skillora_streak') setStreak(parseInt(e.newValue || '0', 10));
      if (e.key === 'skillora_last_study') setLastStudyDate(e.newValue);
      if (e.key === 'skillora_points') setPoints(JSON.parse(e.newValue || '{}'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 py-2 z-50 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      style={{
        willChange: 'transform, opacity',
        boxShadow: 'none',
        borderBottom: 'none',
        background: 'linear-gradient(90deg, #67C090 0%, #26667F 100%)'
      }}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Skillora Logo" className="w-8 h-8 rounded-full bg-white shadow" />
          <span className="text-xl font-bold text-black">Skillora</span>
        </Link>
      </div>
      {/* Streak and Points UI */}
      <div className="flex items-center gap-4 text-lg font-medium w-full justify-end">
        <div className="flex items-center gap-1 group relative">
          <span className="text-orange-500 text-2xl cursor-pointer" title="Streak">
            <img src="/burn.png" alt="Streak" width={28} height={28} className="inline-block align-middle" />
            <span
              className="font-bold text-orange-600 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 px-2 py-1 rounded shadow text-base pointer-events-none"
              style={{whiteSpace: 'nowrap'}}
            >
              {streak} day{streak !== 1 ? 's' : ''}
            </span>
          </span>
        </div>
        <Link href="/profile" className="ml-1 flex items-center group">
          <img src="/user.png" alt="Profile" width={32} height={32} className="inline-block align-middle" />
        </Link>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-12 transition-colors duration-500 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="w-full py-3 bg-gradient-to-r from-green-200 via-green-100 to-cyan-100 text-center text-lg text-gray-700">
            <div className="flex flex-col items-center justify-center">
              <div>
                <Link href="/about" className="mx-4 text-gray-700 hover:text-green-700 transition">About</Link>
                <Link href="/contact" className="mx-4 text-gray-700 hover:text-green-700 transition">Contact Us</Link>
              </div>
              <div className="mt-1 text-sm text-gray-500">@ made by Q-Beta team</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}