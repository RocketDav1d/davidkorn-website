"use client";

import List from "@/components/list";
import EasterEggGame from "@/components/easter-egg-game";
import { GameProvider } from "@/components/game-context";
import Scoreboard, { saveScore } from "@/components/scoreboard";
import { useState, useRef } from "react";

export default function Home() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [wordPositionsMap, setWordPositionsMap] = useState<Map<string, { id: string; x: number; y: number; hit: boolean }>>(new Map());
  const [gameHits, setGameHits] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [finalTime, setFinalTime] = useState(0);
  const handleInitialPositionsRef = useRef<((positions: Map<string, { x: number; y: number }>) => void) | null>(null);
  
  const handleInitialPositions = (positions: Map<string, { x: number; y: number }>) => {
    handleInitialPositionsRef.current?.(positions);
  };
  
  const formatTime = (milliseconds: number) => {
    const totalSeconds = milliseconds / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const ms = Math.floor((milliseconds % 1000) / 10); // Show centiseconds (hundredths)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };
  
  const [scoreboardKey, setScoreboardKey] = useState(0);
  
  const handleScoreAdded = () => {
    setScoreboardKey(prev => prev + 1); // Force scoreboard to refresh
  };

  const handleNameSubmit = (name: string) => {
    if (finalTime > 0) {
      saveScore({
        name: name,
        time: finalTime,
        date: Date.now(),
      });
      setGameWon(false);
      setFinalTime(0);
      handleScoreAdded();
    }
  };

  const handleGameWon = (won: boolean, time: number) => {
    setGameWon(won);
    setFinalTime(time);
  };
  const listItems = [
    {
      parent: "Building",
      children: [
        { text: "Registercheck", symbol: "dot" as const, weight: 500, domain: "registercheck.de" },
        { text: "AttentionFactory", domain: "xplosiv.ai" },
        { text: "Bowie.video", domain: "bowie.video" },
        "Google",
        { text: "Trustyourvc", domain: "trustyourvc.com" },
      ],
    },
    {
      parent: "Reading",
      children: [
        "Albert Camus",
        { text: "Agnes Callard", symbol: "dot" as const },
        "David Deutsch",
        "Deirdre Nansen McCloskey",
        "Denis Johnson",
        { text: "Frederick Taylor", symbol: "star" as const },
        "Irving Kristol",
        "Max Weber / Andrea Maurer",
        "Max Weber",
        "Milton Friedman",
        "Rob Henderson",
        "Roger Eatwell",
        "Sebastian Mallaby",
        { text: "Thomas Piketty", symbol: "star" as const },
        "W. Somerset Maugham",
      ],
    },
    {
      parent: "Listening",
      children: [
        { text: "2hollis", symbol: "star" as const },
        "4evr",
        "Aphex Twin",
        { text: "Brian Eno", symbol: "star" as const },
        "Cro",
        "Future",
        "Hammock",
        "Kanye West",
        "Moby",
        "Richard Wagner",
        "Robert Miles",
        "Snap!",
        { text: "Snow Strippers", symbol: "star" as const },
        "Souly",
        "Ti:esto",
      ],
    },
    {
      parent: "Watching",
      children: [
        "Brothers",
        "Fight Club",
        { text: "Interstellar", symbol: "star" as const },
        "Kill Bill",
        "Prisoners",
        "Seven",
        { text: "Severance", symbol: "dot" as const },
        "Silence of the Lambs",
        "Silicon Valley",
        "Silie",
        { text: "Succession", symbol: "star" as const },
        "The Social Network",
        "The Zodiac Killer",
        { text: "True Detective Season 1", symbol: "star" as const },
      ],
    },
    { parent: "Writing" },
    { parent: "Using" },
    { parent: "Connecting" },
  ];

  return (
    <GameProvider isActive={isGameActive} wordPositions={wordPositionsMap}>
      <div className="flex bg-zinc-50 dark:bg-black overflow-y-auto" style={{ height: '100vh', paddingTop: '50px', boxSizing: 'border-box', maxHeight: '100vh' }}>
        {/* Left Column */}
        <div className="flex w-1/2 items-start justify-center">
          <div className="flex flex-col items-start">
            <div 
              className="mb-4 border-t border-black dark:border-white"
              style={{ width: '100%' }}
            ></div>
            <div className="flex items-baseline gap-4">
              <h1 
                className="text-black dark:text-white whitespace-nowrap"
                style={{ 
                  fontFamily: 'var(--font-braun-linear)',
                  fontWeight: 400,
                  fontSize: '48px'
                }}
              >
                David Korn
              </h1>
            </div>
            <div className="mt-[40px] flex flex-col gap-2">
              <a 
                href="mailto:me@davidkorn.de"
                className="text-black dark:text-white"
                style={{ 
                  fontFamily: 'var(--font-braun-linear)',
                  fontWeight: 400
                }}
              >
                me@davidkorn.de
              </a>
              <div className="flex gap-4">
                <a 
                  href="https://x.com/dav1dk0rn"
                  className="text-black dark:text-white"
                  style={{ 
                    fontFamily: 'var(--font-braun-linear)',
                    fontWeight: 400
                  }}
                >
                  Twitter
                </a>
                <a 
                  href="https://www.linkedin.com/in/korn-david/"
                  className="text-black dark:text-white"
                  style={{ 
                    fontFamily: 'var(--font-braun-linear)',
                    fontWeight: 400
                  }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex w-1/2 items-start justify-center">
          <div className="flex flex-col items-end">
            {isGameActive && (
              <>
                <div 
                  className="mb-4 border-t border-black dark:border-white"
                  style={{ width: '100%' }}
                ></div>
                <div className="flex items-baseline gap-4">
                  <span 
                    className="text-black dark:text-white"
                    style={{ 
                      fontFamily: 'var(--font-braun-linear)',
                      fontWeight: 400,
                      fontSize: '48px',
                      fontVariantNumeric: 'tabular-nums',
                      display: 'inline-block',
                      minWidth: '80px',
                      textAlign: 'right'
                    }}
                  >
                    {gameHits}/10
                  </span>
                </div>
                <div className="mt-[40px]">
                  <span 
                    className="text-black dark:text-white"
                    style={{ 
                      fontFamily: 'var(--font-braun-linear)',
                      fontWeight: 400,
                      fontVariantNumeric: 'tabular-nums',
                      display: 'inline-block',
                      minWidth: '80px',
                      textAlign: 'right'
                    }}
                  >
                    {formatTime(gameTime)}
                  </span>
                </div>
                <div className="mt-8">
                  <List items={listItems} onInitialPositionsReady={handleInitialPositions} />
                  <Scoreboard 
                    key={scoreboardKey} 
                    gameWon={gameWon}
                    finalTime={finalTime}
                    onNameSubmit={handleNameSubmit}
                    onScoreAdded={handleScoreAdded}
                  />
                </div>
              </>
            )}
            {!isGameActive && (
              <>
                <List items={listItems} onInitialPositionsReady={handleInitialPositions} />
                <Scoreboard 
                  key={scoreboardKey}
                  gameWon={gameWon}
                  finalTime={finalTime}
                  onNameSubmit={handleNameSubmit}
                  onScoreAdded={handleScoreAdded}
                />
              </>
            )}
          </div>
        </div>
        <EasterEggGame
          listItems={listItems}
          onGameStateChange={setIsGameActive}
          onWordPositionsChange={setWordPositionsMap}
          onInitialPositionsReadyRef={handleInitialPositionsRef}
          onHitsChange={setGameHits}
          onTimeChange={setGameTime}
          onScoreAdded={handleScoreAdded}
          onGameWon={handleGameWon}
        />
        {!isGameActive && (
          <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 text-zinc-400 dark:text-zinc-600 text-xs"
            style={{ fontFamily: 'var(--font-braun-linear)' }}
          >
            Press <span className="text-zinc-500 dark:text-zinc-500">⌘K</span> to play
          </div>
        )}
      </div>
    </GameProvider>
  );
}
