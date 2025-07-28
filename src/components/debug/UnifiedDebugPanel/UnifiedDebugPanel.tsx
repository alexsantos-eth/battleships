import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useGameStore, type Ship, type Shot } from "@/stores/game";
import { usePlaygroundStore } from "@/stores/playground";
import { COLORS } from "@/config/colors";
import { DEBUG_CONFIG } from "@/utils/debug";

import {
  DebugInfoContent,
  PerformanceContent,
  SystemMetrics,
} from "@/components/debug";
import { GameInitializerPanel } from "../DebugPanel/GameInitializerPanel";

interface ShotInfo {
  hits: number;
  misses: number;
  total: number;
}

interface ShipCounts {
  [key: string]: number;
}

interface UnifiedDebugPanelProps {
  showPlayerBoard?: boolean;
  setShowPlayerBoard?: (show: boolean) => void;
  showEnemyBoard?: boolean;
  setShowEnemyBoard?: (show: boolean) => void;
  showShips?: boolean;
  setShowShips?: (show: boolean) => void;
  showShots?: boolean;
  setShowShots?: (show: boolean) => void;
  alwaysShowEnemyShips?: boolean;
  setAlwaysShowEnemyShips?: (show: boolean) => void;
}

export const UnifiedDebugPanel: React.FC<UnifiedDebugPanelProps> = ({
  showPlayerBoard = true,
  setShowPlayerBoard,
  showEnemyBoard = true,
  setShowEnemyBoard,
  showShips = true,
  setShowShips,
  showShots = true,
  setShowShots,
  alwaysShowEnemyShips = true,
  setAlwaysShowEnemyShips,
}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("game");

  const { user, isLoading, isAuthenticated, reset } = useAuth();
  const { freeCameraMovement, setFreeCameraMovement } = usePlaygroundStore();
  const {
    playerShips,
    enemyShips,
    playerShots,
    enemyShots,
    currentTurn,
    isGameOver,
    winner,
    boardWidth,
    boardHeight,
    setPlayerTurn,
    setEnemyTurn,
  } = useGameStore();

  const isPlaygroundRoute = location.pathname === "/playground";

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "p" || event.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, []);

  if (!isVisible || !isPlaygroundRoute) {
    return null;
  }

  const getShipInfo = (ships: Ship[]) => {
    const shipCounts = ships.reduce((acc, ship) => {
      acc[ship.variant] = (acc[ship.variant] || 0) + 1;
      return acc;
    }, {} as ShipCounts);

    return Object.entries(shipCounts).map(([variant, count]) => (
      <div key={variant} style={{ fontSize: "11px" }}>
        {variant}: {count}
      </div>
    ));
  };

  const getShotInfo = (shots: Shot[]): ShotInfo => {
    const hits = shots.filter(shot => shot.hit).length;
    const misses = shots.filter(shot => !shot.hit).length;
    return { hits, misses, total: shots.length };
  };

  const playerShotInfo = getShotInfo(playerShots);
  const enemyShotInfo = getShotInfo(enemyShots);

  const tabs = [
    { id: "game", label: "Game", icon: "🎮" },
    { id: "controls", label: "Controls", icon: "🎛️" },
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "system", label: "System", icon: "💻" },
    { id: "auth", label: "Auth", icon: "🔐" },
    { id: "debug", label: "Debug", icon: "🐛" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "game":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Game Status
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                <div>Turn: <span style={{ color: "#60a5fa" }}>{currentTurn}</span></div>
                <div>Game Over: <span style={{ color: isGameOver ? "#f87171" : "#4ade80" }}>{isGameOver ? "Yes" : "No"}</span></div>
                <div>Winner: <span style={{ color: "#fbbf24" }}>{winner || "None"}</span></div>
                <div>Board: <span style={{ color: "#22d3ee" }}>{boardWidth}x{boardHeight}</span></div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Player Ships ({playerShips.length})
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                {getShipInfo(playerShips)}
                {playerShips.length === 0 && <div style={{ color: "#9ca3af" }}>No ships</div>}
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Enemy Ships ({enemyShips.length})
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                {getShipInfo(enemyShips)}
                {enemyShips.length === 0 && <div style={{ color: "#9ca3af" }}>No ships</div>}
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Player Shots ({playerShotInfo.total})
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                <div>Hits: <span style={{ color: "#4ade80" }}>{playerShotInfo.hits}</span></div>
                <div>Misses: <span style={{ color: "#f87171" }}>{playerShotInfo.misses}</span></div>
                <div>Accuracy: <span style={{ color: "#fbbf24" }}>{playerShotInfo.total > 0 ? Math.round((playerShotInfo.hits / playerShotInfo.total) * 100) : 0}%</span></div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Enemy Shots ({enemyShotInfo.total})
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                <div>Hits: <span style={{ color: "#4ade80" }}>{enemyShotInfo.hits}</span></div>
                <div>Misses: <span style={{ color: "#f87171" }}>{enemyShotInfo.misses}</span></div>
                <div>Accuracy: <span style={{ color: "#fbbf24" }}>{enemyShotInfo.total > 0 ? Math.round((enemyShotInfo.hits / enemyShotInfo.total) * 100) : 0}%</span></div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Turn Controls
              </h4>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={setPlayerTurn}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  Player Turn
                </button>
                <button
                  onClick={setEnemyTurn}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  Enemy Turn
                </button>
              </div>
            </div>
          </div>
        );

      case "controls":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Visual Controls
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    id="showPlayerBoard"
                    checked={showPlayerBoard}
                    onChange={(e) => setShowPlayerBoard?.(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <label htmlFor="showPlayerBoard" style={{ margin: 0 }}>
                    Player Board
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    id="showEnemyBoard"
                    checked={showEnemyBoard}
                    onChange={(e) => setShowEnemyBoard?.(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <label htmlFor="showEnemyBoard" style={{ margin: 0 }}>
                    Enemy Board
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    id="showShips"
                    checked={showShips}
                    onChange={(e) => setShowShips?.(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <label htmlFor="showShips" style={{ margin: 0 }}>
                    Show Ships
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    id="showShots"
                    checked={showShots}
                    onChange={(e) => setShowShots?.(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <label htmlFor="showShots" style={{ margin: 0 }}>
                    Show Shots
                  </label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    id="alwaysShowEnemyShips"
                    checked={alwaysShowEnemyShips}
                    onChange={(e) => setAlwaysShowEnemyShips?.(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <label htmlFor="alwaysShowEnemyShips" style={{ margin: 0 }}>
                    Always Show Enemy Ships
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#4CAF50" }}>
                Camera Controls
              </h4>
              <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="checkbox"
                    id="freeCameraMovement"
                    checked={freeCameraMovement}
                    onChange={(e) => setFreeCameraMovement(e.target.checked)}
                    style={{ margin: 0 }}
                  />
                  <label htmlFor="freeCameraMovement" style={{ margin: 0 }}>
                    Free Camera Movement
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "performance":
        return (
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#4CAF50" }}>
              Performance
            </h4>
            <PerformanceContent
              renderer={null}
              enabled={DEBUG_CONFIG.ENABLE_PERFORMANCE_MONITOR}
              showAdvanced={DEBUG_CONFIG.SHOW_ADVANCED_METRICS}
              onPerformanceWarning={() => {}}
            />
          </div>
        );

      case "system":
        return (
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#4CAF50" }}>
              System Metrics
            </h4>
            <SystemMetrics
              enabled={true}
              showDetails={DEBUG_CONFIG.SYSTEM_METRICS_SHOW_DETAILS}
              showCpu={false}
            />
          </div>
        );

      case "auth":
        return (
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#4CAF50" }}>
              Authentication
            </h4>
            <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
              <div>Loading: <span style={{ color: isLoading ? "#fbbf24" : "#4ade80" }}>{isLoading ? "true" : "false"}</span></div>
              <div>Authenticated: <span style={{ color: isAuthenticated ? "#4ade80" : "#f87171" }}>{isAuthenticated ? "true" : "false"}</span></div>
              <div>User: <span style={{ color: "#60a5fa" }}>{user ? user.uid : "null"}</span></div>
            </div>
            <button
              onClick={reset}
              style={{
                marginTop: "8px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              Reset Auth
            </button>
          </div>
        );

      case "debug":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <GameInitializerPanel />
            
            <div>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#4CAF50" }}>
                Game Info
              </h4>
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: COLORS.ui.debug.background,
        color: "white",
        borderRadius: "8px",
        maxWidth: "400px",
        maxHeight: "600px",
        overflow: "hidden",
        zIndex: 1002,
        fontSize: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        border: `1px solid ${COLORS.ui.debug.border}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 15px",
          borderBottom: `1px solid ${COLORS.ui.debug.border}`,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "14px" }}>Debug Panel</h2>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "transparent",
            color: "white",
            border: `1px solid ${COLORS.ui.debug.border}`,
            borderRadius: "4px",
            padding: "2px 6px",
            cursor: "pointer",
            fontSize: "10px",
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${COLORS.ui.debug.border}`,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: activeTab === tab.id ? "#4CAF50" : "transparent",
              color: "white",
              border: "none",
              padding: "8px 4px",
              cursor: "pointer",
              fontSize: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "12px" }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div
        style={{
          padding: "15px",
          overflow: "auto",
          maxHeight: "500px",
        }}
      >
        {renderTabContent()}
      </div>

      <div
        style={{
          padding: "8px 15px",
          borderTop: `1px solid ${COLORS.ui.debug.border}`,
          fontSize: "10px",
          opacity: 0.7,
          textAlign: "center",
        }}
      >
        Press 'P' to toggle • {activeTab}
      </div>
    </div>
  );
}; 