import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  DebugInfoContent,
  PerformanceContent,
  SystemMetrics,
} from "@/components/debug";
import { COLORS } from "@/config/colors";
import { DEBUG_CONFIG } from "@/utils/debug";

import { GameInitializerPanel } from "./GameInitializerPanel";

export const DebugPanel: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<boolean>(
    DEBUG_CONFIG.ENABLE_DEBUG_PANEL
  );
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  const isPlaygroundRoute = location.pathname === "/playground";

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "p" || event.key === "P") {
        if (DEBUG_CONFIG.ENABLE_DEBUG_PANEL) {
          setIsVisible((prev) => !prev);
        }
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, []);

  if (
    !DEBUG_CONFIG.ENABLE_DEBUG_PANEL ||
    isManuallyClosed ||
    !isVisible ||
    !isPlaygroundRoute
  ) {
    return null;
  }

  const getPanelStyles = () => {
    const baseStyles = {
      position: "fixed" as const,
      background: COLORS.ui.debug.background,
      color: "white",
      padding: "15px",
      borderRadius: "8px",
      maxWidth: DEBUG_CONFIG.DEBUG_PANEL_MAX_WIDTH,
      maxHeight: DEBUG_CONFIG.DEBUG_PANEL_MAX_HEIGHT,
      overflow: "auto" as const,
      zIndex: 1002,
      fontSize: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      border: `1px solid ${COLORS.ui.debug.border}`,
    };

    const position = DEBUG_CONFIG.DEBUG_PANEL_POSITION;

    const positionStyles = {
      "top-left": { top: "10px", left: "10px" },
      "top-right": { top: "10px", right: "10px" },
      "bottom-left": { bottom: "10px", left: "10px" },
      "bottom-right": { bottom: "10px", right: "10px" },
    };

    return {
      ...baseStyles,
      ...positionStyles[position as keyof typeof positionStyles],
    };
  };

  return (
    <div style={getPanelStyles()}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          borderBottom: `1px solid ${COLORS.ui.debug.border}`,
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "16px" }}>Debug Panel</h2>
        <button
          onClick={() => {
            setIsVisible(false);
            setIsManuallyClosed(true);
          }}
          style={{
            background: "transparent",
            color: "white",
            border: `1px solid ${COLORS.ui.debug.border}`,
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "10px",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <GameInitializerPanel />

        {DEBUG_CONFIG.SHOW_PERFORMANCE_SECTION && (
          <div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
              Performance
            </h3>
            <PerformanceContent
              renderer={null}
              enabled={DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR}
              showAdvanced={DEBUG_CONFIG.SHOW_ADVANCED_METRICS}
              onPerformanceWarning={() => {}}
            />
          </div>
        )}

        {DEBUG_CONFIG.SHOW_SYSTEM_METRICS && (
          <div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>System</h3>
            <SystemMetrics
              enabled={true}
              showDetails={DEBUG_CONFIG.SYSTEM_METRICS_SHOW_DETAILS}
              showCpu={false}
            />
          </div>
        )}

        {DEBUG_CONFIG.SHOW_GAME_INFO_SECTION && (
          <div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
              Game Info
            </h3>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "11px",
              }}
            >
              <DebugInfoContent />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "15px",
          paddingTop: "10px",
          borderTop: `1px solid ${COLORS.ui.debug.border}`,
          fontSize: "10px",
          opacity: 0.7,
        }}
      >
        Press 'P' to toggle • {DEBUG_CONFIG.DEBUG_PANEL_POSITION}
      </div>
    </div>
  );
};
