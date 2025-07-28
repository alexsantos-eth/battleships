import React from "react";
import { Game } from "@/components/features/Game";
import { UnifiedDebugPanel } from "@/components/debug/UnifiedDebugPanel";
import { GameOverModal } from "@/components/layouts/GameOverModal";
import type { GameScreenProps } from "./GameScreen.types";

export const GameScreen: React.FC<GameScreenProps> = () => {
  return (
    <>
      <Game />
      <UnifiedDebugPanel />
      <GameOverModal />
    </>
  );
}; 