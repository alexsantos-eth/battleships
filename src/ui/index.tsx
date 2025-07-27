import { useState } from "react";
import { useLocation } from "react-router-dom";

import { COLORS } from "@/config/colors";
import { useGameStore } from "@/stores/gameStore";
import { eventBus, EVENTS } from "@/utils/eventBus";

const UIBox: React.FC = () => {
  const location = useLocation();
  const [isPlayerPerspective, setIsPlayerPerspective] = useState(false);
  const { currentTurn, isPlayerTurn, toggleTurn } = useGameStore();

  const isPlaygroundRoute = location.pathname === "/playground";

  const handlePlayerCamera = () => {
    if (!isPlayerTurn) {
      setIsPlayerPerspective(!isPlayerPerspective);
      eventBus.emit(EVENTS.CAMERA_TOGGLE_PLAYER_PERSPECTIVE, {
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
          backgroundColor: isPlayerPerspective ? COLORS.ui.danger : COLORS.ui.debug.button,
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {isPlayerPerspective ? "Vista Enemigo" : "Vista Jugador"}
      </button>

      {isPlaygroundRoute && (
        <button
          onClick={toggleTurn}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            padding: "10px 20px",
            backgroundColor: COLORS.ui.primary,
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Cambiar Turno
        </button>
      )}
    </>
  );
};

export default UIBox;
