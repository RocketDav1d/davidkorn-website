"use client";

import List from "@/components/list";
import EasterEggGame from "@/components/easter-egg-game";
import { GameProvider } from "@/components/game-context";
import Scoreboard, { saveScore } from "@/components/scoreboard";
import Gallery from "@/components/gallery";
import { useState, useRef } from "react";

// Gallery images - add your photos to public/gallery/ and list them here
const galleryImages: string[] = [
  // "/gallery/photo1.jpg",
  // "/gallery/photo2.jpg",
  // "/gallery/photo3.jpg",
];

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
      parent: "Work",
      children: [
        {
          text: "Registercheck",
          symbol: "dot" as const,
          weight: 500,
          domain: "registercheck.de",
          role: "Co-Founder / CEO",
          dateRange: "Nov 2024 - Present",
          description: "Co-founded and built Registercheck, a platform providing continuously updated ownership, corporate, and financial data on German companies.",
        },
        {
          text: "Trustyourvc",
          domain: "trustyourvc.com",
          role: "Co-Founder CTO",
          dateRange: "Jan 2024 - Present",
          description: "Co-founded and built Trustyourvc, a platform where European VCs and angel investors are rated by founders to increase transparency in fundraising. Responsible for technical architecture and product development.",
        },
        {
          text: "bunch.capital",
          domain: "bunch.capital",
          role: "Process Engineering",
          dateRange: "Dec 2022 - Aug 2023",
          description: "Built internal tools and automated core operational workflows to improve scalability across fund and venture operations, replacing manual processes with repeatable systems.",
        },
        {
          text: "Google",
          role: "Client Project / Technical Development",
          dateRange: "Mar 2023 - May 2023",
          description: "Built a platform for Google's Governance & Public Policy team to analyze sentiment of key DACH-region policymakers on technology and regulation. Designed data pipelines and an interactive sentiment matrix used to segment and target policymakers; project size ≈€80k.",
        },
        {
          text: "lemon.markets",
          domain: "lemon.markets",
          role: "GTM / Growth",
          dateRange: "Jun 2022 - Sep 2022",
          description: "Worked on GTM for their brokerage API, supporting developer acquisition through example trading systems and help validate early distribution channels.",
        },
      ],
    },
    {
      parent: "Projects",
      children: [
        {
          text: "Aurea Berlin",
          domain: "joinaurea.com",
          description: "Co-founded Aurea, a Berlin-based hacker house built to create a focused, high-trust environment for builders and independent thinkers. We're a sister house of SF based \"The Residency\" and consist of two apartments designed around shared values rather than credentials. We select residents by agency > everything else.",
        },
        {
          text: "warmebetten.berlin",
          domain: "warmebetten.berlin",
          description: "A coordination platform built with local Berlin homeless shelters that shows real-time shelter capacity and helps citizens and emergency services bring homeless people to available shelters, built during Berlin's coldest winter in ~16 years when capacity was especially constrained.",
        },
        {
          text: "Xplosiv.ai",
          domain: "xplosiv.ai",
          description: "A platform that provides pre-warmed U.S.-based TikTok accounts in specific niches. Accounts are warmed up over seven days and then handed over so users can post directly from the platform to reach the U.S. market from day one.",
        },
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
            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-8 w-full max-w-[300px]">
                <Gallery images={galleryImages} rotationInterval={3000} />
              </div>
            )}
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
