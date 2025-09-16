"use client";

import { useState, useEffect } from 'react';
import { analyzeGameState } from '@/ai/flows/ai-game-analysis';
import type { AnalyzeGameStateOutput } from '@/ai/flows/ai-game-analysis';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Lightbulb } from 'lucide-react';
import type { Tile } from '@/lib/types';

interface AIAnalysisDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tiles: Tile[];
  score: number;
}

const tilesToBoard = (tiles: Tile[]): number[][] => {
  const board = Array.from({ length: 4 }, () => Array(4).fill(0));
  tiles.forEach(tile => {
    board[tile.row][tile.col] = tile.value;
  });
  return board;
};

export default function AIAnalysisDialog({ isOpen, setIsOpen, tiles, score }: AIAnalysisDialogProps) {
  const [analysis, setAnalysis] = useState<AnalyzeGameStateOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const getAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
          const boardState = tilesToBoard(tiles);
          const result = await analyzeGameState({ boardState, score });
          setAnalysis(result);
        } catch (error) {
          console.error("Error getting AI analysis:", error);
          setAnalysis({ analysis: "Sorry, I couldn't analyze the board right now. Please try again later.", shouldShowAnalysis: true });
        } finally {
          setIsLoading(false);
        }
      };
      getAnalysis();
    }
  }, [isOpen, tiles, score]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="text-accent" />
            AI Game Analysis
          </DialogTitle>
          <DialogDescription>
            Here's a strategic analysis of your current game state.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[120px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Analyzing your board...</span>
            </div>
          ) : (
            analysis && (
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {analysis.shouldShowAnalysis 
                  ? analysis.analysis 
                  : "You're on the right track! Keep merging those tiles."}
              </p>
            )
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
