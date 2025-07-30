import { useState } from "react";

import { useGameStore } from "@/bundle/stores/game/gameStore";
import { COLORS } from "@/config/colors/palette";
import { CAMERA_EVENTS, cameraEventBus } from "@/events/camera/bus";

const UIBox: React.FC = () => {
  const [isPlayerPerspective, setIsPlayerPerspective] = useState(false);
  const { currentTurn, isPlayerTurn } = useGameStore();

  const handlePlayerCamera = () => {
    if (!isPlayerTurn) {
      setIsPlayerPerspective(!isPlayerPerspective);
      cameraEventBus.emit(CAMERA_EVENTS.CAMERA_TOGGLE_PLAYER_PERSPECTIVE, {
        isPlayerPerspective: !isPlayerPerspective,
      });
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: isPlayerTurn ? COLORS.ui.success : COLORS.ui.danger,
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {currentTurn}
      </div>

      <button
        onClick={handlePlayerCamera}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "120px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: isPlayerPerspective
            ? COLORS.ui.danger
            : COLORS.ui.debug.button,
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {isPlayerPerspective ? "Vista Enemigo" : "Vista Jugador"}
      </button>
    </>
  );
};

export default UIBox;
