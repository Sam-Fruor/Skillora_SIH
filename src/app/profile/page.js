"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState({});
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    setStreak(parseInt(localStorage.getItem("skillora_streak") || "0", 10));
    setPoints(JSON.parse(localStorage.getItem("skillora_points") || "{}"));
    setActivity(JSON.parse(localStorage.getItem("skillora_activity") || "[]"));
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 mt-16 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-green-800 mb-4">Your Profile</h1>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-orange-500 text-3xl" title="Streak">
          <img src="/burn.png" alt="Streak" width={36} height={36} className="inline-block align-middle" />
        </span>
        <span className="text-2xl font-bold text-orange-600">{streak} day streak</span>
      </div>
      <h2 className="text-xl font-semibold text-blue-700 mb-2">Points by Subject</h2>
      <ul className="mb-6">
        {Object.keys(points).length === 0 && <li className="text-gray-500">No points yet.</li>}
        {Object.entries(points).map(([subject, pts]) => (
          <li key={subject} className="flex justify-between border-b py-1">
            <span className="capitalize">{subject}</span>
            <span className="font-bold text-green-700">{pts} pts</span>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold text-blue-700 mb-2">Recent Activity</h2>
      <ul>
        {activity.length === 0 && <li className="text-gray-500">No activity yet.</li>}
        {activity.slice(-10).reverse().map((act, i) => (
          <li key={i} className="border-b py-1 text-gray-700 text-sm">
            <span className="font-bold text-green-700">{act.subject}</span> - {act.action} ({act.date})
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 underline">Back to Home</Link>
      </div>
    </main>
  );
}
