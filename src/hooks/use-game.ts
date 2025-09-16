"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Tile } from '@/lib/types';

type GameState = {
  tiles: Tile[];
  score: number;
};

const GRID_SIZE = 4;
let tileIdCounter = 1;

const createEmptyBoard = (): number[][] => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const getEmptyCells = (board: number[][]) => {
  const emptyCells: { row: number, col: number }[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

const tilesToBoard = (tiles: Tile[]): number[][] => {
  const board = createEmptyBoard();
  tiles.forEach(tile => {
    if (tile) {
      board[tile.row][tile.col] = tile.value;
    }
  });
  return board;
};

const getHighestId = (tiles: Tile[]): number => {
  return tiles.reduce((maxId, tile) => Math.max(tile.id, maxId), 0);
};

export const useGame = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [history, setHistory] = useState<GameState[]>([]);

  // Load game from localStorage on initial render
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore');
    setBestScore(Number(savedBestScore) || 0);

    const savedGameState = localStorage.getItem('gameState');
    if (savedGameState) {
      try {
        const { tiles: savedTiles, score: savedScore } = JSON.parse(savedGameState);
        if (savedTiles && typeof savedScore === 'number') {
          tileIdCounter = getHighestId(savedTiles) + 1;
          setTiles(savedTiles);
          setScore(savedScore);
          return;
        }
      } catch (e) {
        // Corrupted save, start a new game
        localStorage.removeItem('gameState');
      }
    }
    
    startNewGame();
  }, []); // Eslint-disable-line react-hooks/exhaustive-deps

  // Save game to localStorage whenever it changes
  useEffect(() => {
    if (tiles.length > 0) {
      const gameState = JSON.stringify({ tiles, score });
      localStorage.setItem('gameState', gameState);
    }
  }, [tiles, score]);

  const addNewTile = useCallback((currentTiles: Tile[]): Tile[] => {
    const board = tilesToBoard(currentTiles);
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return currentTiles;

    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const newTile: Tile = { id: tileIdCounter++, value, row, col, isNew: true };
    
    return [...currentTiles, newTile];
  }, []);
  
  const updateBestScore = useCallback((currentScore: number) => {
    if (currentScore > bestScore) {
      setBestScore(currentScore);
      localStorage.setItem('bestScore', String(currentScore));
    }
  }, [bestScore]);

  const startNewGame = useCallback(() => {
    tileIdCounter = 1;
    let initialTiles = addNewTile([]);
    initialTiles = addNewTile(initialTiles);
    setTiles(initialTiles);
    setScore(0);
    setGameOver(false);
    setHistory([]);
    localStorage.removeItem('gameState');
  }, [addNewTile]);

  const saveState = useCallback(() => {
    const currentState = { tiles: JSON.parse(JSON.stringify(tiles)), score };
    setHistory(prevHistory => [...prevHistory, currentState]);
  }, [tiles, score]);
  
  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setTiles(lastState.tiles);
      setScore(lastState.score);
      setHistory(prevHistory => prevHistory.slice(0, -1));
      setGameOver(false);
    }
  }, [history]);
  
  const resetBestScore = useCallback(() => {
    setBestScore(0);
    localStorage.removeItem('bestScore');
  }, []);

  const move = useCallback((direction: 'Up' | 'Down' | 'Left' | 'Right') => {
    if (gameOver) return;

    saveState();

    let moved = false;
    let newScore = score;
    let currentTiles = JSON.parse(JSON.stringify(tiles)) as Tile[];
    currentTiles.forEach(t => {
      delete t.isNew;
      delete t.isMerged;
    });

    const board = tilesToBoard(currentTiles);
    const isVertical = direction === 'Up' || direction === 'Down';
    const isReverse = direction === 'Right' || direction === 'Down';
    
    const newTiles: Tile[] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        const line: Tile[] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            const row = isVertical ? j : i;
            const col = isVertical ? i : j;
            const tile = currentTiles.find(t => t.row === row && t.col === col);
            if (tile) {
                line.push(tile);
            }
        }

        if (isReverse) line.reverse();

        const newLine: Tile[] = [];
        for (let j = 0; j < line.length; j++) {
            if (j < line.length - 1 && line[j].value === line[j + 1].value) {
                const mergedTile: Tile = {
                    ...line[j],
                    value: line[j].value * 2,
                    isMerged: true,
                };
                newScore += mergedTile.value;
                newLine.push(mergedTile);
                j++; // Skip next tile
                moved = true;
            } else {
                newLine.push(line[j]);
            }
        }

        // Move tiles to their new positions
        for (let j = 0; j < GRID_SIZE; j++) {
            const row = isVertical ? j : i;
            const col = isVertical ? i : j;
            
            const originalIndex = isReverse ? GRID_SIZE - 1 - j : j;

            if (newLine[originalIndex]) {
                const tile = newLine[originalIndex];
                if (tile.row !== row || tile.col !== col) {
                    moved = true;
                }
                tile.row = row;
                tile.col = col;
                newTiles.push(tile);
            }
        }
    }
    
    // Consolidate unique tiles
    const uniqueTiles = Array.from(new Map(newTiles.map(item => [item['id'], item])).values());
    
    if (moved) {
      setScore(newScore);
      updateBestScore(newScore);
      const nextTiles = addNewTile(uniqueTiles);
      setTiles(nextTiles);

      // Check for game over
      if (nextTiles.length === GRID_SIZE * GRID_SIZE) {
          const board = tilesToBoard(nextTiles);
          let canMove = false;
          for (let r = 0; r < GRID_SIZE; r++) {
              for (let c = 0; c < GRID_SIZE; c++) {
                  const val = board[r][c];
                  if (r < GRID_SIZE - 1 && board[r + 1][c] === val) canMove = true;
                  if (c < GRID_SIZE - 1 && board[r][c + 1] === val) canMove = true;
              }
          }
          if (!canMove) {
              setGameOver(true);
          }
      }
    } else {
      // If no move happened, pop the saved state
      setHistory(prev => prev.slice(0, -1));
    }

  }, [tiles, score, gameOver, addNewTile, updateBestScore, saveState]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    if (e.ctrlKey && e.key === 'z') {
      undo();
      return;
    }
    switch (e.key) {
      case 'ArrowUp': move('Up'); break;
      case 'ArrowDown': move('Down'); break;
      case 'ArrowLeft': move('Left'); break;
      case 'ArrowRight': move('Right'); break;
    }
  }, [move, undo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) return;
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) { // swipe threshold
      if (absDx > absDy) {
        move(dx > 0 ? 'Right' : 'Left');
      } else {
        move(dy > 0 ? 'Down' : 'Up');
      }
    }
    setTouchStart(null);
  };


  return { tiles, score, bestScore, gameOver, handleKeyDown, startNewGame, handleTouchStart, handleTouchMove, handleTouchEnd, undo, canUndo: history.length > 0, resetBestScore };
};
