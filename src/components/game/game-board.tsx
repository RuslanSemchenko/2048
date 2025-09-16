import type { FC } from 'react';
import type { Tile as TileType } from '@/lib/types';
import TileComponent from './tile-component';

interface GameBoardProps {
  tiles: TileType[];
}

const GameBoard: FC<GameBoardProps> = ({ tiles }) => {
  return (
    <div className="relative w-full aspect-square bg-card p-3 rounded-lg">
      {/* Background cells */}
      <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-full">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="bg-background/50 rounded-md" />
        ))}
      </div>
      
      {/* Tiles */}
      <div className="absolute inset-0 p-3">
        {tiles.map(tile => (
          <TileComponent key={tile.id} {...tile} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
