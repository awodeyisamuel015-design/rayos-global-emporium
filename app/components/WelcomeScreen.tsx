"use client";

import { useEffect, useState } from "react";

type Props = {
  onFinish: () => void;
};

export default function WelcomeScreen({ onFinish }: Props) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // SAFE finish handler (prevents React crash)
  useEffect(() => {
    if (timeLeft <= 0) {
      const timeout = setTimeout(() => {
        onFinish();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [timeLeft, onFinish]);

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center
        text-center
        bg-white/90 dark:bg-black/90
        backdrop-blur-2xl
        px-6
      "
    >
      {/* LOGO */}
      <div className="text-7xl mb-4 animate-bounce">
        👑
      </div>

      {/* TITLE */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
        Rayos Global Emporium
      </h1>

      {/* MESSAGE */}
      <p className="text-lg md:text-xl opacity-80 max-w-2xl mb-8">
        Welcome to a world of luxury, elegance & premium fashion.
      </p>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mb-10">
        <div className="glass-card p-6 rounded-2xl">
          ✨ Premium Quality
        </div>

        <div className="glass-card p-6 rounded-2xl">
          🛍️ Exclusive Collections
        </div>

        <div className="glass-card p-6 rounded-2xl">
          🚚 Fast & Reliable Delivery
        </div>
      </div>

      {/* COUNTDOWN */}
      <p className="mb-4 text-lg">
        Entering store in {timeLeft}s...
      </p>

      {/* PROGRESS BAR */}
      <div className="w-72 h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 transition-all duration-1000"
          style={{
            width: `${((15 - timeLeft) / 15) * 100}%`,
          }}
        />
      </div>

      {/* OPTIONAL: SKIP BUTTON (PREMIUM UX) */}
      <button
        onClick={onFinish}
        className="mt-6 text-sm opacity-60 hover:opacity-100 transition"
      >
        Skip intro →
      </button>
    </div>
  );
}