'use server';

/**
 * @fileOverview Provides AI-driven analysis of the 2048 game state, offering strategic options to improve gameplay.
 *
 * - analyzeGameState - Analyzes the current game state and suggests strategic options.
 * - AnalyzeGameStateInput - The input type for the analyzeGameState function.
 * - AnalyzeGameStateOutput - The return type for the analyzeGameState function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGameStateInputSchema = z.object({
  boardState: z
    .array(z.array(z.number()))
    .describe('The current state of the 2048 game board.'),
  score: z.number().describe('The current score of the game.'),
});
export type AnalyzeGameStateInput = z.infer<typeof AnalyzeGameStateInputSchema>;

const AnalyzeGameStateOutputSchema = z.object({
  analysis: z.string().describe('The AI analysis of the game state and strategic options.'),
  shouldShowAnalysis: z
    .boolean()
    .describe(
      'Whether to show the analysis to the user based on the game state and score.'
    ),
});
export type AnalyzeGameStateOutput = z.infer<typeof AnalyzeGameStateOutputSchema>;

export async function analyzeGameState(input: AnalyzeGameStateInput): Promise<AnalyzeGameStateOutput> {
  return analyzeGameStateFlow(input);
}

const analyzeGameStatePrompt = ai.definePrompt({
  name: 'analyzeGameStatePrompt',
  input: {schema: AnalyzeGameStateInputSchema},
  output: {schema: AnalyzeGameStateOutputSchema},
  prompt: `You are an AI game analyst for the 2048 tile-merging puzzle game.

You will receive the current game board state and the player's score. You will analyze the board for potential strategic moves and provide suggestions to the player on how to improve their gameplay.

Board State:
{{#each boardState}}
  {{this}}
{{/each}}

Current Score: {{score}}

Based on the current board state and score, determine whether providing a detailed overview of strategic options will enhance the player's understanding and enjoyment. If the game is in a critical state or the player's score is low, suggest improvements or alternatives.  Set the 
shouldShowAnalysis output field appropriately.

Include the following in your analysis:
- Identify potential merge opportunities.
- Suggest the best direction to move based on the current tile layout.
- Explain the reasoning behind your suggestions.
- Offer alternative strategies if the current approach is not optimal.`,
});

const analyzeGameStateFlow = ai.defineFlow(
  {
    name: 'analyzeGameStateFlow',
    inputSchema: AnalyzeGameStateInputSchema,
    outputSchema: AnalyzeGameStateOutputSchema,
  },
  async input => {
    const {output} = await analyzeGameStatePrompt(input);
    return output!;
  }
);
