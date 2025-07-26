import { COLORS } from "@/config/colors";
import { useGameStore } from "@/stores/gameStore";

const UIBox: React.FC = () => {
  const { currentTurn, isPlayerTurn, toggleTurn } = useGameStore();

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
        onClick={toggleTurn}
        style={{
          right: "20px",
          zIndex: 1000,
          bottom: "20px",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          position: "absolute",
          borderRadius: "5px",
          padding: "10px 20px",
          backgroundColor: COLORS.ui.primary,
        }}
      >
        Cambiar Turno
      </button>
    </>
  );
};

export default UIBox;
