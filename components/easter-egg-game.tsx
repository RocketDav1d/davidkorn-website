"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { GameProvider } from "./game-context";

interface Word {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hit: boolean;
  elementRef?: React.RefObject<HTMLDivElement>;
}

interface Arrow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface ListItem {
  parent: string;
  children?: Array<string | { text: string; symbol?: "dot" | "star"; weight?: number; domain?: string }>;
}

interface EasterEggGameProps {
  listItems: ListItem[];
  onGameStateChange?: (isActive: boolean) => void;
  onWordPositionsChange?: (positions: Map<string, { id: string; x: number; y: number; hit: boolean }>) => void;
  onInitialPositionsReadyRef?: React.MutableRefObject<((positions: Map<string, { x: number; y: number }>) => void) | null>;
  onHitsChange?: (hits: number) => void;
  onTimeChange?: (time: number) => void; // in milliseconds
  onScoreAdded?: () => void;
  onGameWon?: (won: boolean, finalTime: number) => void;
}

export default function EasterEggGame({ listItems, onGameStateChange, onWordPositionsChange, onInitialPositionsReadyRef, onHitsChange, onTimeChange, onScoreAdded, onGameWon }: EasterEggGameProps) {
  const [isActive, setIsActive] = useState(false);
  const [characterX, setCharacterX] = useState(-50);
  const [words, setWords] = useState<Word[]>([]);
  const [arrow, setArrow] = useState<Arrow | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [chargePower, setChargePower] = useState(0);
  const [aimAngle, setAimAngle] = useState(0);
  const [hits, setHits] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gameTime, setGameTime] = useState(0); // in milliseconds
  const [finalTime, setFinalTime] = useState(0); // final time when won
  const gameStartTimeRef = useRef<number>(0);
  
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  let particleIdCounter = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const characterYRef = useRef(400);
  const wordsRef = useRef<Word[]>([]);
  const arrowRef = useRef<Arrow | null>(null);
  const hitsRef = useRef(0);
  const [wordPositionsMap, setWordPositionsMap] = useState<Map<string, { id: string; x: number; y: number; hit: boolean }>>(new Map());
  const initialPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update character Y on window resize and mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      characterYRef.current = window.innerHeight / 2;
      const handleResize = () => {
        characterYRef.current = window.innerHeight / 2;
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const CHARACTER_SIZE = 30;
  const ARROW_SPEED = 15;
  const MAX_CHARGE = 100;

  // Extract all words from listItems
  const extractWords = () => {
    const allWords: Word[] = [];
    let idCounter = 0;
    
    listItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          const text = typeof child === "string" ? child : child.text;
          allWords.push({
            id: `word-${idCounter++}`,
            text,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            hit: false,
          });
        });
      }
    });
    
    return allWords;
  };

  // Handle initial positions from List component
  const handleInitialPositions = useCallback((positions: Map<string, { x: number; y: number }>) => {
    initialPositionsRef.current = positions;
    setIsTransitioning(true);
    
    // Start transition animation
    setTimeout(() => {
      if (typeof window !== "undefined") {
        const allWords = extractWords();
        const targetWords: Word[] = allWords.map((word) => {
          const initialPos = initialPositionsRef.current.get(word.id);
          const targetX = Math.random() * (window.innerWidth - 200) + 100;
          const targetY = Math.random() * (window.innerHeight - 100) + 100;
          
          return {
            ...word,
            x: initialPos ? initialPos.x : targetX,
            y: initialPos ? initialPos.y : targetY,
            vx: (Math.random() - 0.5) * 4 + (Math.random() > 0.5 ? 1 : -1),
            vy: (Math.random() - 0.5) * 4 + (Math.random() > 0.5 ? 1 : -1),
          };
        });
        
        setWords(targetWords);
        wordsRef.current = targetWords;
        
        // Animate to target positions
        const duration = 800; // ms
        const startTime = Date.now();
        const startPositions = new Map(targetWords.map(w => [w.id, { x: w.x, y: w.y }]));
        const endPositions = new Map(targetWords.map(w => {
          const initialPos = initialPositionsRef.current.get(w.id);
          return [w.id, {
            x: initialPos ? Math.random() * (window.innerWidth - 200) + 100 : w.x,
            y: initialPos ? Math.random() * (window.innerHeight - 100) + 100 : w.y,
          }];
        }));
        
        const animateTransition = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          
          const newWords = targetWords.map((word) => {
            const startPos = startPositions.get(word.id)!;
            const endPos = endPositions.get(word.id)!;
            
            return {
              ...word,
              x: startPos.x + (endPos.x - startPos.x) * easeProgress,
              y: startPos.y + (endPos.y - startPos.y) * easeProgress,
            };
          });
          
          wordsRef.current = newWords;
          setWords(newWords);
          
          const newMap = new Map<string, { id: string; x: number; y: number; hit: boolean }>();
          newWords.forEach((word) => {
            newMap.set(word.id, { id: word.id, x: word.x, y: word.y, hit: word.hit });
          });
          setWordPositionsMap(newMap);
          onWordPositionsChange?.(newMap);
          
          if (progress < 1) {
            requestAnimationFrame(animateTransition);
          } else {
            setIsTransitioning(false);
            // Update to final positions with velocities
            const finalWords = targetWords.map((word) => ({
              ...word,
              x: endPositions.get(word.id)!.x,
              y: endPositions.get(word.id)!.y,
            }));
            wordsRef.current = finalWords;
            setWords(finalWords);
          }
        };
        
        requestAnimationFrame(animateTransition);
      }
    }, 100);
  }, [listItems, onWordPositionsChange]);

  // Expose handleInitialPositions via ref
  useEffect(() => {
    if (onInitialPositionsReadyRef) {
      onInitialPositionsReadyRef.current = handleInitialPositions;
    }
  }, [onInitialPositionsReadyRef, handleInitialPositions]);

  // Initialize words when game starts (fallback if no initial positions)
  useEffect(() => {
    if (isActive && words.length === 0 && typeof window !== "undefined" && initialPositionsRef.current.size === 0) {
      const allWords = extractWords();
      
      const initialWords: Word[] = allWords.map((word) => ({
        ...word,
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 100) + 100,
        vx: (Math.random() - 0.5) * 4 + (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * 4 + (Math.random() > 0.5 ? 1 : -1),
      }));
      
      setWords(initialWords);
      wordsRef.current = initialWords;
      
      const newMap = new Map<string, { id: string; x: number; y: number; hit: boolean }>();
      initialWords.forEach((word) => {
        newMap.set(word.id, { id: word.id, x: word.x, y: word.y, hit: word.hit });
      });
      setWordPositionsMap(newMap);
      onWordPositionsChange?.(newMap);
    }
  }, [isActive, words.length, listItems]);

  // Sync refs with state
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    arrowRef.current = arrow;
  }, [arrow]);

  useEffect(() => {
    hitsRef.current = hits;
  }, [hits]);

  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  // Keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const newActive = !isActive;
        setIsActive(newActive);
        onGameStateChange?.(newActive);
        if (newActive) {
          // Game starting
          setCharacterX(-50);
          setHits(0);
          setGameWon(false);
          setWords([]);
          setArrow(null);
          setParticles([]);
          particlesRef.current = [];
          setGameTime(0);
          setFinalTime(0);
          setGameWon(false);
          gameStartTimeRef.current = Date.now();
          onGameWon?.(false, 0);
          onHitsChange?.(0);
          onTimeChange?.(0);
        } else {
          // Game ending
          setGameTime(0);
          setFinalTime(0);
          setGameWon(false);
          gameStartTimeRef.current = 0;
          onGameWon?.(false, 0);
          onHitsChange?.(0);
          onTimeChange?.(0);
        }
      }
      if (e.key === "Escape" && isActive) {
        setIsActive(false);
        onGameStateChange?.(false);
        setGameTime(0);
        setFinalTime(0);
        setGameWon(false);
        gameStartTimeRef.current = 0;
        onGameWon?.(false, 0);
        onHitsChange?.(0);
        onTimeChange?.(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  // Mouse position tracking
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      
      if (isCharging && characterX > 50) {
        const dx = mousePosRef.current.x - characterX;
        const dy = mousePosRef.current.y - characterYRef.current;
        setAimAngle(Math.atan2(dy, dx));
      }
    };

    const handleMouseDown = () => {
      if (characterX > 50 && !arrowRef.current?.active) {
        setIsCharging(true);
      }
    };

    const handleMouseUp = () => {
      if (isCharging && characterX > 50) {
        const power = Math.min(chargePower, MAX_CHARGE) / MAX_CHARGE;
        const speed = ARROW_SPEED * power;
        
        const newArrow = {
          x: characterX + CHARACTER_SIZE / 2,
          y: characterYRef.current,
          vx: Math.cos(aimAngle) * speed,
          vy: Math.sin(aimAngle) * speed,
          active: true,
        };
        
        arrowRef.current = newArrow;
        setArrow(newArrow);
        setIsCharging(false);
        setChargePower(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isActive, isCharging, chargePower, aimAngle, characterX]);

  // Charge power increase
  useEffect(() => {
    if (!isCharging) return;

    const interval = setInterval(() => {
      setChargePower((prev) => Math.min(prev + 2, MAX_CHARGE));
    }, 16);

    return () => clearInterval(interval);
  }, [isCharging]);

  // Game loop
  useEffect(() => {
    if (!isActive || typeof window === "undefined") return;

    const animate = () => {
      // Update game time (in milliseconds)
      if (gameStartTimeRef.current > 0 && !gameWon) {
        const elapsed = Date.now() - gameStartTimeRef.current;
        setGameTime(elapsed);
        onTimeChange?.(elapsed);
      }
      
      // Animate character walking in
      if (characterX < 100) {
        setCharacterX((prev) => Math.min(prev + 3, 100));
      }

      // Update words position
      const updatedWords = wordsRef.current.map((word) => {
        if (word.hit) return word;

        let newX = word.x + word.vx;
        let newY = word.y + word.vy;

        // Bounce off walls
        if (newX < 0 || newX > window.innerWidth - 100) {
          word.vx *= -1;
          newX = Math.max(0, Math.min(window.innerWidth - 100, word.x));
        }
        if (newY < 0 || newY > window.innerHeight - 100) {
          word.vy *= -1;
          newY = Math.max(0, Math.min(window.innerHeight - 100, word.y));
        } else {
          newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
          newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
        }

        return { ...word, x: newX, y: newY };
      });
      wordsRef.current = updatedWords;
      setWords(updatedWords);
      
      // Update positions map
      const newMap = new Map<string, { id: string; x: number; y: number; hit: boolean }>();
      updatedWords.forEach((word) => {
        newMap.set(word.id, { id: word.id, x: word.x, y: word.y, hit: word.hit });
      });
      setWordPositionsMap(newMap);
      onWordPositionsChange?.(newMap);

      // Update particles
      const updatedParticles = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life + 1,
          vy: particle.vy + 0.15, // gravity
        }))
        .filter((particle) => particle.life < particle.maxLife);
      
      particlesRef.current = updatedParticles;
      setParticles(updatedParticles);

      // Update arrow
      if (arrowRef.current?.active) {
        const currentArrow = arrowRef.current;
        const newX = currentArrow.x + currentArrow.vx;
        const newY = currentArrow.y + currentArrow.vy;

        // Check collision with words
        const hitWord = wordsRef.current.find((word) => {
          if (word.hit) return false;
          const dist = Math.sqrt(
            Math.pow(newX - (word.x + 50), 2) + Math.pow(newY - (word.y + 20), 2)
          );
          return dist < 50;
        });

        if (hitWord) {
          // Create particle burst effect
          const hitX = hitWord.x + 50;
          const hitY = hitWord.y + 20;
          const newParticles: Particle[] = [];
          const particleCount = 12;
          
          for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 3 + Math.random() * 2;
            newParticles.push({
              id: `particle-${particleIdCounter.current++}`,
              x: hitX,
              y: hitY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 0,
              maxLife: 20 + Math.random() * 10,
            });
          }
          
          particlesRef.current = [...particlesRef.current, ...newParticles];
          setParticles(particlesRef.current);
          
          const newWords = wordsRef.current.map((w) =>
            w.id === hitWord.id ? { ...w, hit: true } : w
          );
          wordsRef.current = newWords;
          setWords(newWords);
          
          // Update positions map
          const newMap = new Map<string, { id: string; x: number; y: number; hit: boolean }>();
          newWords.forEach((word) => {
            newMap.set(word.id, { id: word.id, x: word.x, y: word.y, hit: word.hit });
          });
          setWordPositionsMap(newMap);
          onWordPositionsChange?.(newMap);
          
          const newHits = hitsRef.current + 1;
          hitsRef.current = newHits;
          setHits(newHits);
          
          if (newHits >= 10) {
            const finalTimeMs = Date.now() - gameStartTimeRef.current;
            setFinalTime(finalTimeMs);
            setGameTime(finalTimeMs);
            onTimeChange?.(finalTimeMs);
            setGameWon(true);
            onGameWon?.(true, finalTimeMs);
          }
          onHitsChange?.(newHits);
          
          arrowRef.current = null;
          setArrow(null);
        } else if (
          newX < 0 ||
          newX > window.innerWidth ||
          newY < 0 ||
          newY > window.innerHeight
        ) {
          arrowRef.current = null;
          setArrow(null);
        } else {
          arrowRef.current = { ...currentArrow, x: newX, y: newY };
          setArrow(arrowRef.current);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, characterX, words, arrow, isCharging, chargePower, aimAngle, hits, gameWon, onTimeChange, onHitsChange, onWordPositionsChange, onScoreAdded]);

  return (
    <>
      {isActive && (
        <>
          {/* Character */}
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${characterX}px`,
              top: `${characterYRef.current}px`,
              width: `${CHARACTER_SIZE}px`,
              height: `${CHARACTER_SIZE}px`,
            }}
          >
            <div className="w-full h-full bg-black dark:bg-white">
              <div className="absolute top-2 left-2 w-1 h-1 bg-white dark:bg-black"></div>
              <div className="absolute top-2 right-2 w-1 h-1 bg-white dark:bg-black"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-0.5 bg-white dark:bg-black"></div>
            </div>
          </div>

          {/* Arrow - small square */}
          {arrow?.active && (
            <div
              className="fixed z-50 pointer-events-none bg-black dark:bg-white"
              style={{
                left: `${arrow.x - 3}px`,
                top: `${arrow.y - 3}px`,
                width: '6px',
                height: '6px',
              }}
            />
          )}

          {/* Aim line when charging - retro style */}
          {isCharging && characterX > 50 && (
            <div
              className="fixed z-40 pointer-events-none"
              style={{
                left: `${characterX + CHARACTER_SIZE / 2}px`,
                top: `${characterYRef.current + CHARACTER_SIZE / 2}px`,
                transform: `rotate(${aimAngle}rad)`,
                transformOrigin: "0 0",
              }}
            >
              {/* Main dashed line */}
              <div
                className="bg-black dark:bg-white"
                style={{
                  width: `${50 + (chargePower / MAX_CHARGE) * 30}px`,
                  height: "3px",
                  opacity: 0.8 + (chargePower / MAX_CHARGE) * 0.2,
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    currentColor 0px,
                    currentColor 5px,
                    transparent 5px,
                    transparent 10px
                  )`,
                  imageRendering: 'pixelated',
                }}
              />
              {/* Center solid line for definition */}
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 bg-black dark:bg-white"
                style={{
                  width: `${50 + (chargePower / MAX_CHARGE) * 30}px`,
                  height: "1px",
                  opacity: 0.6,
                }}
              />
            </div>
          )}

          {/* Particles - pixelated burst effect */}
          {particles.map((particle) => {
            const opacity = Math.max(0, 1 - (particle.life / particle.maxLife));
            const size = 3 + Math.sin(particle.life * 0.5) * 1;
            return (
              <div
                key={particle.id}
                className="fixed pointer-events-none bg-black dark:bg-white"
                style={{
                  left: `${particle.x - size / 2}px`,
                  top: `${particle.y - size / 2}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: opacity * 0.9,
                  imageRendering: 'pixelated',
                  zIndex: 45,
                }}
              />
            );
          })}


        </>
      )}
    </>
  );
}
