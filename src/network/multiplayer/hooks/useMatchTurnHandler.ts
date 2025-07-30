import { useEffect } from "react";
import { useMatchConnection } from "./useMatchConnection";
import { useGameStore } from "@/bundle/stores/game/gameStore";

export const useMatchTurnHandler = () => {
  const { room, currentPlayer } = useMatchConnection();
  const {
    checkShot,
    addEnemyShot,
    isShipDestroyed,
    setPlayerTurn,
    boardWidth,
    boardHeight,
  } = useGameStore();

  const isHost = currentPlayer?.role === "host";

  const shots = (isHost ? room?.guestShots : room?.hostShots) ?? [];
  const shotsLength = shots?.length ?? 0;

  useEffect(() => {
    if (shotsLength) {
      const lastShot = shots[shotsLength - 1];
      const shot = checkShot(
        boardWidth - 1 - lastShot.x,
        boardHeight - 1 - lastShot.y,
        false
      );

      addEnemyShot({
        x: lastShot.x,
        y: lastShot.y,
        hit: shot.hit,
        shipId: shot.shipId,
      });

      if (shot.hit) {
        const shipDestroyed =
          shot.shipId !== undefined &&
          shot.shipId !== -1 &&
          isShipDestroyed(shot.shipId, false);

        if (shipDestroyed) {
          setPlayerTurn();
        }
      } else {
        setPlayerTurn();
      }
    }
  }, [shotsLength]);
};
