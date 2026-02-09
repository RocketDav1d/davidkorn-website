"use client";

import { Heart, Circle } from "lucide-react";
import { useGameContext } from "./game-context";
import { useRef, useEffect, useState } from "react";

interface ListItem {
  parent: string;
  children?: Array<string | { text: string; symbol?: "dot" | "star"; weight?: number; domain?: string }>;
}

interface ListProps {
  items: ListItem[];
  onInitialPositionsReady?: (positions: Map<string, { x: number; y: number }>) => void;
}

export default function List({ items, onInitialPositionsReady }: ListProps) {
  const { isActive, wordPositions } = useGameContext();
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [positionsCaptured, setPositionsCaptured] = useState(false);
  
  // Extract all words with their IDs - consistent ID generation
  const getAllWords = () => {
    const allWords: Array<{ id: string; text: string; child: string | { text: string; symbol?: "dot" | "star"; weight?: number; domain?: string } }> = [];
    let idCounter = 0;
    
    items.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const text = typeof child === "string" ? child : child.text;
          allWords.push({
            id: `word-${idCounter++}`,
            text,
            child,
          });
        });
      }
    });
    
    return allWords;
  };

  const allWords = getAllWords();
  const wordIdMap = useRef<Map<number, string>>(new Map());

  // Capture initial positions right when game becomes active (before switching to flying mode)
  useEffect(() => {
    if (isActive && !wordPositions.size && itemRefs.current.size > 0 && onInitialPositionsReady) {
      // Capture positions immediately while still in normal layout
      const positions = new Map<string, { x: number; y: number }>();
      allWords.forEach((wordData) => {
        const element = itemRefs.current.get(wordData.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          positions.set(wordData.id, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        }
      });
      if (positions.size > 0) {
        onInitialPositionsReady(positions);
        setPositionsCaptured(true);
      }
    }
    
    // Reset when game ends
    if (!isActive) {
      setPositionsCaptured(false);
    }
  }, [isActive, wordPositions.size, onInitialPositionsReady, allWords]);

  if (isActive && positionsCaptured && wordPositions.size > 0) {
    // Render flying words
    return (
      <>
        {allWords.map((wordData) => {
          const position = wordPositions.get(wordData.id);
          if (!position || position.hit) return null;
          
          const child = wordData.child;
          const childText = typeof child === "string" ? child : child.text;
          const symbol = typeof child === "string" ? undefined : child.symbol;
          const weight = typeof child === "string" ? undefined : child.weight;
          const domain = typeof child === "string" ? undefined : child.domain;
          
          return (
            <div
              key={wordData.id}
              className="fixed z-40 pointer-events-none flex items-center"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                fontFamily: 'var(--font-braun-linear)',
                fontWeight: weight || 400,
              }}
            >
              {domain ? (
                <a 
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black dark:text-white hover:opacity-70"
                >
                  {childText}
                </a>
              ) : (
                <span className="text-black dark:text-white">{childText}</span>
              )}
              {symbol === "dot" && (
                <Circle className="ml-2 inline-block" size={7} fill="currentColor" />
              )}
              {symbol === "star" && (
                <Heart className="ml-2 inline-block" size={8} fill="currentColor" />
              )}
            </div>
          );
        })}
      </>
    );
  }

  // Normal list rendering
  return (
    <ul className="text-black dark:text-white list-none">
      {items.map((item, index) => (
        <li key={index} className={item.parent === "Building" ? "mb-6" : "mb-2"}>
          <div className="font-normal">{item.parent}</div>
          {item.children && item.children.length > 0 && (
            <ul className="list-none mt-1 ml-6">
              {item.children.map((child, childIndex) => {
                const childText = typeof child === "string" ? child : child.text;
                const symbol = typeof child === "string" ? undefined : child.symbol;
                const weight = typeof child === "string" ? undefined : child.weight;
                const domain = typeof child === "string" ? undefined : child.domain;
                
                // Find matching word ID
                const wordData = allWords.find(w => w.text === childText);
                const wordId = wordData?.id || `word-${childIndex}`;
                
                // Store mapping for this render
                if (!wordIdMap.current.has(childIndex)) {
                  wordIdMap.current.set(childIndex, wordId);
                }
                
                return (
                  <li 
                    key={childIndex} 
                    className="mb-1 flex items-center"
                    ref={(el) => {
                      if (el && wordId) {
                        itemRefs.current.set(wordId, el);
                      } else if (!el && wordId) {
                        itemRefs.current.delete(wordId);
                      }
                    }}
                  >
                    {domain ? (
                      <a 
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-70"
                        style={{ fontWeight: weight }}
                      >
                        {childText}
                      </a>
                    ) : (
                      <span style={{ fontWeight: weight }}>{childText}</span>
                    )}
                    {symbol === "dot" && (
                      <Circle className="ml-2 inline-block" size={7} fill="currentColor" />
                    )}
                    {symbol === "star" && (
                      <Heart className="ml-2 inline-block" size={8} fill="currentColor" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

