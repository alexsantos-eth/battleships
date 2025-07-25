import { useState } from "react";

import { eventBus, EVENTS } from "../utils/eventBus";

const UIBox: React.FC = () => {
  const [isShooting, setIsShooting] = useState(false);

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
      <button
        onClick={handleShoot}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: isShooting ? "#dc3545" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {isShooting ? "Volver" : "Disparar"}
      </button>

      <button
        style={{
          position: "absolute",
          bottom: "20px",
          right: "140px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        "Izquierda Cámara"
      </button>
    </>
  );
};

export default UIBox;
