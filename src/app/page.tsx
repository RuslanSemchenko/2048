"use client";

import { useGame } from '@/hooks/use-game';
import GameBoard from '@/components/game/game-board';
import GameOverDialog from '@/components/game/game-over-dialog';
import AIAnalysisDialog from '@/components/game/ai-analysis-dialog';
import { Button } from '@/components/ui/button';
import { Gamepad2, Undo2, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const {
    tiles,
    score,
    gameOver,
    bestScore,
    handleKeyDown,
    startNewGame,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    undo,
    canUndo,
    resetBestScore,
  } = useGame();
  
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  

  return (
    <main 
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 font-headline"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
        <header className="flex items-center justify-between w-full">
          <h1 className="text-5xl md:text-7xl font-bold text-primary">2048</h1>
          <div className="flex gap-2">
            <div className="flex flex-col items-center justify-center p-3 rounded-md bg-card aspect-square text-center">
              <span className="text-xs font-bold text-muted-foreground">SCORE</span>
              <span className="text-2xl font-bold text-accent">{score}</span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex flex-col items-center justify-center p-3 rounded-md bg-card aspect-square text-center cursor-pointer hover:bg-card/80 transition-colors">
                  <span className="text-xs font-bold text-muted-foreground">BEST</span>
                  <span className="text-2xl font-bold text-accent">{bestScore}</span>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Best Score?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reset your best score of {bestScore} to 0? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetBestScore}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        <div className="flex items-center justify-between w-full mb-4">
          <p className="text-muted-foreground text-sm md:text-base">
            Join the numbers to get to the <strong>2048 tile!</strong>
          </p>
          <div className="flex gap-2">
            <Button onClick={undo} variant="secondary" size="sm" disabled={!canUndo}>
              <Undo2 className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button onClick={startNewGame} size="sm">
              <Gamepad2 className="mr-2 h-4 w-4" /> New Game
            </Button>
          </div>
        </div>

        <GameBoard tiles={tiles} />

        <footer className="w-full flex flex-col items-center gap-4 text-center text-muted-foreground mt-4 text-sm">
          <p><strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> or <strong>swipe</strong> to move the tiles. Tiles with the same number merge into one when they touch.</p>
          <Button onClick={() => setIsAnalysisOpen(true)} variant="outline" size="sm">
              <Lightbulb className="mr-2 h-4 w-4" /> Get a Hint
          </Button>
        </footer>
      </div>
      <GameOverDialog isOpen={gameOver} score={score} onRestart={startNewGame} />
      <AIAnalysisDialog isOpen={isAnalysisOpen} setIsOpen={setIsAnalysisOpen} tiles={tiles} score={score} />
    </main>
  );
}
