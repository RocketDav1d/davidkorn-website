"use client";

import { createContext, useContext, ReactNode } from "react";

interface WordPosition {
  id: string;
  x: number;
  y: number;
  hit: boolean;
}

interface GameContextType {
  isActive: boolean;
  wordPositions: Map<string, WordPosition>;
}

const GameContext = createContext<GameContextType>({
  isActive: false,
  wordPositions: new Map(),
});

export const useGameContext = () => useContext(GameContext);

export function GameProvider({
  children,
  isActive,
  wordPositions,
}: {
  children: ReactNode;
  isActive: boolean;
  wordPositions: Map<string, WordPosition>;
}) {
  return (
    <GameContext.Provider value={{ isActive, wordPositions }}>
      {children}
    </GameContext.Provider>
  );
}

