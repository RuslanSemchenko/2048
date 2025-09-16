import type { FC } from 'react';
import { cn } from '@/lib/utils';
import type { Tile } from '@/lib/types';

const TILE_SIZE_PERCENT = 25; // Each tile is 25% of the container
const GAP_REMS = 0.75; // The gap is 0.75rem (12px)
const GRID_SIZE = 4;

const tileColorMap: Record<number, { tile: string; text: string }> = {
  2:    { tile: 'bg-primary/50', text: 'text-foreground' },
  4:    { tile: 'bg-primary/70', text: 'text-foreground' },
  8:    { tile: 'bg-accent/40', text: 'text-accent-foreground' },
  16:   { tile: 'bg-accent/60', text: 'text-accent-foreground' },
  32:   { tile: 'bg-accent/80', text: 'text-primary-foreground' },
  64:   { tile: 'bg-accent', text: 'text-primary-foreground' },
  128:  { tile: 'bg-yellow-400', text: 'text-primary-foreground' },
  256:  { tile: 'bg-yellow-500', text: 'text-primary-foreground' },
  512:  { tile: 'bg-yellow-600', text: 'text-primary-foreground' },
  1024: { tile: 'bg-yellow-700', text: 'text-primary-foreground' },
  2048: { tile: 'bg-yellow-800', text: 'text-primary-foreground' },
};

const getTileStyles = (value: number) => {
  const styles = tileColorMap[value] || { tile: 'bg-gray-700', text: 'text-white' };
  const textSize = value > 1000 ? 'text-2xl' : value > 100 ? 'text-3xl' : 'text-4xl';
  return { ...styles, textSize };
};

const TileComponent: FC<Tile> = ({ value, row, col, isNew, isMerged }) => {
  const { tile, text, textSize } = getTileStyles(value);

  const style = {
    // The translate function positions the tile in the correct grid cell
    transform: `translate(calc(${col * 100}% + ${col * GAP_REMS}rem), calc(${row * 100}% + ${row * GAP_REMS}rem))`,
    // The width/height calculation accounts for the gaps between tiles
    width: `calc(${TILE_SIZE_PERCENT}% - ${GAP_REMS * (GRID_SIZE - 1) / GRID_SIZE}rem)`,
    height: `calc(${TILE_SIZE_PERCENT}% - ${GAP_REMS * (GRID_SIZE - 1) / GRID_SIZE}rem)`,
  };

  return (
    <div
      style={style}
      className={cn(
        'absolute flex items-center justify-center font-bold rounded-md transition-transform duration-300 ease-in-out',
        tile,
        text,
        textSize,
        isNew && 'animate-tile-spawn',
        isMerged && 'animate-tile-merge'
      )}
    >
      {value}
    </div>
  );
};

export default TileComponent;
