import { useEffect, useState } from "react";

import GameGrid from "@/components/GameGrid";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import EnvironmentBox from "@/env";
import { useGameStore } from "@/stores/gameStore";
import UIBox from "@/ui";
import { DEBUG_CONFIG } from "@/utils/debug";

import { DebugInfo } from "./components/DebugInfo";

const App = () => {
  const { initializeGame } = useGameStore();
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState<boolean>(
    DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR
  );

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "p" || event.key === "P") {
        setShowPerformanceMonitor((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handlePerformanceWarning = (message: string) => {
    if (DEBUG_CONFIG.PERFORMANCE_WARNINGS_ENABLED) {
      console.warn("Performance Warning:", message);
    }
  };

  return (
    <>
      <EnvironmentBox>
        <GameGrid isPlayerBoard={true} />
        <GameGrid
          isPlayerBoard={false}
          enablePressGrid
          rotation={[0, 0, Math.PI]}
          position={[0, 9, 0]}
        />
      </EnvironmentBox>
      <UIBox />

      {/* Performance Monitor - Press P to toggle */}
      <PerformanceDashboard
        renderer={null} // Will be set by the hook
        enabled={showPerformanceMonitor}
        position={DEBUG_CONFIG.PERFORMANCE_MONITOR_POSITION}
        showAdvanced={DEBUG_CONFIG.SHOW_ADVANCED_METRICS}
        onPerformanceWarning={handlePerformanceWarning}
      />

      <DebugInfo />

      {/* Keyboard shortcut to toggle performance monitor */}
      {DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "3px",
            fontSize: "12px",
            fontFamily: "monospace",
            zIndex: 1000,
          }}
        >
          Press <kbd>P</kbd> to toggle performance monitor
        </div>
      )}
    </>
  );
};

export default App;
