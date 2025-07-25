import { useState } from "react";

import { COLORS } from "@/config/colors";
import { useGameStore } from "@/stores/gameStore";
import { eventBus, EVENTS } from "@/utils/eventBus";

const UIBox: React.FC = () => {
  const [isShooting, setIsShooting] = useState(false);
  const { currentTurn, isPlayerTurn } = useGameStore();

  const handleShoot = () => {
    if (isShooting) {
      eventBus.emit(EVENTS.CAMERA_SHOOT_END);
      setIsShooting(false);
    } else {
      eventBus.emit(EVENTS.CAMERA_SHOOT_START);
      setIsShooting(true);
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
        onClick={handleShoot}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: isShooting ? COLORS.ui.danger : COLORS.ui.primary,
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {isShooting ? "Volver" : "Disparar"}
      </button>
    </>
  );
};

export default UIBox;
