"use client";

import { useState, useEffect } from "react";

export interface Score {
  name: string;
  time: number; // in milliseconds
  date: number; // timestamp
}

const STORAGE_KEY = "easter-egg-scores";

export function getScores(): Score[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveScore(score: Score): void {
  if (typeof window === "undefined") return;
  try {
    const scores = getScores();
    scores.push(score);
    // Sort by time (fastest first)
    scores.sort((a, b) => a.time - b.time);
    // Keep only top 10
    const topScores = scores.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topScores));
  } catch {
    // Ignore errors
  }
}

interface ScoreboardProps {
  onScoreAdded?: () => void;
  gameWon?: boolean;
  finalTime?: number;
  onNameSubmit?: (name: string) => void;
}

export default function Scoreboard({ onScoreAdded, gameWon, finalTime, onNameSubmit }: ScoreboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setScores(getScores());
  }, []);

  // Refresh scores when onScoreAdded callback changes (indicating a new score was added)
  useEffect(() => {
    if (onScoreAdded) {
      setScores(getScores());
    }
  }, [onScoreAdded]);

  // Blinking cursor animation
  useEffect(() => {
    if (gameWon && finalTime && !scores.find(s => s.time === finalTime)) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      return () => clearInterval(interval);
    } else {
      setShowCursor(true);
    }
  }, [gameWon, finalTime, scores]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = milliseconds / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const ms = Math.floor((milliseconds % 1000) / 10); // Show centiseconds
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && playerName.trim() && finalTime && onNameSubmit) {
      onNameSubmit(playerName.trim());
      setPlayerName("");
      setScores(getScores()); // Refresh scores immediately
    }
  };

  // Determine if we should show the pending entry
  const showPendingEntry = gameWon && finalTime && !scores.find(s => s.time === finalTime);

  if (scores.length === 0 && !showPendingEntry) return null;

  return (
    <div className="mt-8">
      <div 
        className="text-black dark:text-white mb-2"
        style={{ 
          fontFamily: 'var(--font-braun-linear)',
          fontWeight: 400,
          fontSize: '16px'
        }}
      >
        Scoreboard
      </div>
      <div className="flex flex-col gap-1">
        {scores.map((score, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 text-black dark:text-white"
            style={{ 
              fontFamily: 'var(--font-braun-linear)',
              fontWeight: 400,
              fontSize: '14px'
            }}
          >
            <span style={{ minWidth: '20px', fontVariantNumeric: 'tabular-nums' }}>
              {index + 1}.
            </span>
            <span style={{ minWidth: '150px' }}>{score.name}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(score.time)}
            </span>
          </div>
        ))}
        {showPendingEntry && (
          <div 
            className="flex items-center gap-4 text-black dark:text-white"
            style={{ 
              fontFamily: 'var(--font-braun-linear)',
              fontWeight: 400,
              fontSize: '14px'
            }}
          >
            <span style={{ minWidth: '20px', fontVariantNumeric: 'tabular-nums' }}>
              {scores.length + 1}.
            </span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-transparent border-none outline-none text-black dark:text-white"
              style={{ 
                fontFamily: 'var(--font-braun-linear)',
                fontWeight: 400,
                fontSize: '14px',
                minWidth: '150px',
                width: '150px'
              }}
            />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(finalTime!)}
              {showCursor && (
                <span 
                  className="inline-block w-2 h-4 ml-1 align-middle"
                  style={{ 
                    backgroundColor: 'currentColor',
                    opacity: showCursor ? 1 : 0,
                    transition: 'opacity 0.5s'
                  }}
                ></span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

