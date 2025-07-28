import React from "react";
import type { GameLoadingScreenProps } from "./GameLoadingScreen.types";

export const GameLoadingScreen: React.FC<GameLoadingScreenProps> = ({
  isLoading,
  isInitialized,
  gameConfig,
  onForceInitialization,
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Armada.io</h2>
        <p className="text-blue-200 mb-4">Preparando la batalla naval...</p>
        <div className="text-sm text-blue-300 space-y-2">
          <p>Estado: {isLoading ? "Cargando" : "No cargando"}</p>
          <p>Inicializado: {isInitialized ? "Sí" : "No"}</p>
          <p>Configuración: {gameConfig ? "Lista" : "No lista"}</p>
        </div>
        <button
          onClick={onForceInitialization}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Forzar Inicialización
        </button>
      </div>
    </div>
  );
}; 