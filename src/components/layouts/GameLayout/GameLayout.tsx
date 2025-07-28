import React from "react";
import type { GameLayoutProps } from "./GameLayout.types";
import { UnifiedDebugPanel } from "@/components/debug/UnifiedDebugPanel";

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  className = "",
  showDebugPanel = false,
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white text-center">
            🚢 Armada.io
          </h1>
          <p className="text-blue-200 text-center mt-2">
            Batalla naval inmersiva en 3D
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">{children}</div>

          {showDebugPanel && (
            <aside className="lg:w-80">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Panel de Debug
                </h2>
                <UnifiedDebugPanel />
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  );
};
