"use client";

import { useEffect, useState } from "react";

const musicalNotes = ["♪", "♫", "♬", "♩", "♭", "♮", "♯"];
const instruments = ["🎸", "🎹", "🎺", "🎻", "🥁", "🎤"];

export function FloatingMusicalElements() {
  const [elements, setElements] = useState<Array<{
    id: number;
    emoji: string;
    left: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Create floating elements
    const newElements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: Math.random() > 0.5 
        ? musicalNotes[Math.floor(Math.random() * musicalNotes.length)]
        : instruments[Math.floor(Math.random() * instruments.length)],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <div
          key={element.id}
          className="musical-note text-purple-300/40"
          style={{
            left: `${element.left}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
            fontSize: `${1 + Math.random() * 1.5}rem`,
          }}
        >
          {element.emoji}
        </div>
      ))}
      {/* Sparkles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

